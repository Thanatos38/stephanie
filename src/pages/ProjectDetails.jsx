import "../App.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";
import emailjs from "emailjs-com";
import { Rnd } from "react-rnd";

const EDIT_KEY = import.meta.env.VITE_EDIT_KEY || "stephanie2024";

function useEditMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("edit") === "true" && params.get("key") === EDIT_KEY;
}

export default function ProjectDetail({ darkMode, setDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [canvasLayout, setCanvasLayout] = useState(null); // null = loading
  const [allImages, setAllImages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const isEditMode = useEditMode();

  // ── Fetch project ───────────────────────────────────────────────────────────
  useEffect(() => {
    client
      .fetch(
        `*[_type=="project" && _id==$id][0]{
          _id,
          title,
          tagline,
          shortDesc,
          longDesc,
          "team": team[]{name, role, link},
          client,
          date,
          theme,
          highlights,
          "coverImage": coverImage.asset->url,
          "gallery": gallery | order(orderRank){
            layout,
            "url": image.asset->url
          },
          "images": images[].asset->url
        }`,
        { id }
      )
      .then(setProject);
  }, [id]);

  // ── Fetch / init project canvas layout ─────────────────────────────────────
  useEffect(() => {
    if (!id) return;

    const docId = `projectCanvas_${id}`;

    const initCanvas = async () => {
      try {
        const existing = await client.fetch(
          `*[_id == $docId][0]`,
          { docId }
        );

        if (!existing) {
          await client.createIfNotExists({
            _id: docId,
            _type: "projectCanvas",
            projectId: id,
            elements: [],
          });
        }

        const data = await client.fetch(
          `*[_id == $docId][0]{ elements }`,
          { docId }
        );
        setCanvasLayout(data?.elements || []);
      } catch (err) {
        console.error("Canvas init error:", err);
        setCanvasLayout([]);
      }
    };

    initCanvas();
  }, [id]);

  // ── Fetch all project images for picker ────────────────────────────────────
  useEffect(() => {
    if (!project) return;

    const imgs = [];
    if (project.coverImage) imgs.push(project.coverImage);
    if (project.images) imgs.push(...project.images);
    if (project.gallery) imgs.push(...project.gallery.map((g) => g.url).filter(Boolean));
    setAllImages([...new Set(imgs.filter(Boolean))]);
  }, [project]);

  // ── Canvas helpers ──────────────────────────────────────────────────────────
  const handleUpdate = (index, updatedItem) => {
    const updated = [...canvasLayout];
    updated[index] = updatedItem;
    setCanvasLayout(updated);
    setSaved(false);
  };

  const addImageToCanvas = (src) => {
    const newElement = {
      _key: Date.now().toString(),
      x: 60,
      y: 60,
      width: 320,
      height: 320,
      src,
      zIndex: (canvasLayout?.length || 0) + 1,
    };
    setCanvasLayout((prev) => [...(prev || []), newElement]);
    setShowPicker(false);
    setSaved(false);
  };

  const removeElement = (index) => {
    setCanvasLayout((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const saveLayout = async () => {
    const docId = `projectCanvas_${id}`;
    setSaving(true);
    try {
      await client
        .patch(docId)
        .set({ elements: canvasLayout })
        .commit();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Language ────────────────────────────────────────────────────────────────
  const changeLanguage = (lang) => {
    if (lang === "en") return;
    const url = window.location.origin;
    window.open(
      `https://translate.google.com/translate?sl=en&tl=de&u=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  // ── Email ───────────────────────────────────────────────────────────────────
  const sendEmail = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_yfqxm7b", "template_ymqtwfr", form.current, "JnaqPcJ-xA1ZrWQep")
      .then(
        () => { alert("Message sent successfully!"); form.current.reset(); },
        (error) => { console.error(error); alert("Failed to send message."); }
      );
  };

  if (!project) return <div>Loading...</div>;

  const galleryData =
    project.gallery?.length > 0
      ? project.gallery
      : project.images?.map((img, i) => ({
          url: img,
          layout: i % 5 === 0 ? "full" : "small",
        }));

  // Does this project have a canvas with images?
  const hasCanvas = canvasLayout !== null && canvasLayout.length > 0;

  return (
    <div className="project-detail-page">

      {/* ── NAVBAR ── */}
      <header className="navbar scrolled">
        {menuOpen && (
          <div className="menu-overlay">
            <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
            <div className="menu-links">
              <button onClick={() => navigate("/")}>Home</button>
              <button onClick={() => navigate("/set")}>Set</button>
              <button onClick={() => navigate("/stage")}>Stage</button>
              <button onClick={() => navigate("/costume")}>Costume</button>
              <button onClick={() => navigate("/about")}>About</button>
              <button onClick={() => navigate("/contact")}>Contact</button>
            </div>
          </div>
        )}

        <div className="logo" onClick={() => navigate("/")}>Stephanie Traut</div>

        <nav className="nav-links">
          <a onClick={() => navigate("/set")}>Set</a>
          <a onClick={() => navigate("/stage")}>Stage</a>
          <a onClick={() => navigate("/costume")}>Costume</a>
          <a onClick={() => navigate("/about")}>About</a>
          <a onClick={() => navigate("/contact")}>Contact</a>
        </nav>

        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setDarkMode && setDarkMode(!darkMode)}>
            <div className={`toggle-track ${darkMode ? "dark" : ""}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>
          <div className="lang-switch">
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("de")}>DE</button>
          </div>
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span><span></span><span></span>
          </div>
        </div>
      </header>

      {/* ── COVER IMAGE ── */}
      <section className="project-full-image">
        <img src={project.coverImage} alt="" />
      </section>

      {/* ── EDIT MODE TOOLBAR ── */}
      {isEditMode && (
        <div style={toolbarStyle}>
          <span style={{ fontWeight: 600, color: "#d4c5a9", letterSpacing: "0.08em" }}>
            ✦ Edit Mode — {project.title}
          </span>
          <span style={{ opacity: 0.55, fontSize: "0.7rem" }}>
            Drag to move · Corner to resize · ✕ to remove
          </span>
          <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
            <button style={btnStyle("#3a3a3a", "#d4c5a9")} onClick={() => setShowPicker(true)}>
              + Add Image
            </button>
            <button
              style={btnStyle(saved ? "#4a7c4a" : "#d4c5a9", saved ? "#fff" : "#111")}
              onClick={saveLayout}
              disabled={saving}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Layout"}
            </button>
          </div>
        </div>
      )}

      {/* ── IMAGE PICKER MODAL ── */}
      {isEditMode && showPicker && (
        <div style={overlayStyle} onClick={() => setShowPicker(false)}>
          <div style={pickerStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ margin: 0, fontFamily: "Cormorant Garamond, serif", fontWeight: 400, fontSize: "1.4rem" }}>
                Add Image to Canvas
              </h3>
              <button style={btnStyle("#eee", "#333")} onClick={() => setShowPicker(false)}>✕ Close</button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "1rem", fontFamily: "monospace" }}>
              Images from this project's gallery
            </p>
            <div style={pickerGridStyle}>
              {allImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt=""
                  style={pickerImgStyle}
                  onClick={() => addImageToCanvas(src)}
                  onMouseEnter={(e) => { e.target.style.opacity = "0.75"; e.target.style.transform = "scale(0.97)"; }}
                  onMouseLeave={(e) => { e.target.style.opacity = "1"; e.target.style.transform = "scale(1)"; }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── FREE-FORM CANVAS (shown when there are canvas images, or in edit mode) ── */}
      {(hasCanvas || isEditMode) && (
        <section style={{ position: "relative", minHeight: "80vh", background: "#faf9f6" }}>
          {canvasLayout?.map((el, i) => (
            <Rnd
              key={el._key || i}
              size={{ width: el.width || 280, height: el.height || 280 }}
              position={{ x: el.x || 0, y: el.y || 0 }}
              bounds="parent"
              disableDragging={!isEditMode}
              enableResizing={isEditMode}
              onDragStop={(e, d) =>
                handleUpdate(i, { ...el, x: d.x, y: d.y })
              }
              onResizeStop={(e, direction, ref, delta, position) =>
                handleUpdate(i, {
                  ...el,
                  width: ref.offsetWidth,
                  height: ref.offsetHeight,
                  ...position,
                })
              }
              style={{ zIndex: el.zIndex || 1 }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <img
                  src={el.src}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  draggable={false}
                />
                {isEditMode && (
                  <button
                    onClick={() => removeElement(i)}
                    style={removeBtn}
                    title="Remove image"
                  >
                    ✕
                  </button>
                )}
              </div>
            </Rnd>
          ))}

          {canvasLayout?.length === 0 && isEditMode && (
            <div style={emptyHint}>
              Click <strong>+ Add Image</strong> to build your project canvas.
            </div>
          )}
        </section>
      )}

      {/* ── STANDARD GALLERY (shown when no canvas layout set) ── */}
      {!hasCanvas && !isEditMode && (
        <section className="project-gallery">
          <div className="gallery">
            {galleryData?.map((item, i) => (
              <div key={i} className={`gallery-item ${item.layout}`}>
                <img src={item.url} alt="" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PROJECT INFO ── */}
      <section className="project-intro">
        <div className="intro-left">
          <h1>{project.title}</h1>
          <p className="tagline">{project.tagline}</p>

          <div className="project-meta">
            {project.client && <p className="meta-item">{project.client}</p>}
            {project.date && (
              <p className="meta-item">
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </p>
            )}
            {project.team?.map((member, index) => (
              <p key={index} className="meta-item">
                <span className="role"><strong>{member.role}</strong></span><br />
                <span className="name">{member.name}</span>
              </p>
            ))}
          </div>

          <p className="project-desc">{project.shortDesc}</p>
        </div>
      </section>

      {/* ── LONG DESCRIPTION ── */}
      <section className="project-longdesc">
        <div className="desc-container">
          <p className="desc-text">{project.longDesc}</p>
        </div>
      </section>

      {/* ── CONTACT / FOOTER ── */}
      <section className="contact">
        <div className="contact-inner">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Reach out today.</p>

          <form className="contact-form" onSubmit={sendEmail} ref={form}>
            <label>Name</label>
            <input type="text" name="user_name" placeholder="Enter your name" required />
            <label>Email</label>
            <input type="email" name="user_email" placeholder="Enter your email" required />
            <label>Message</label>
            <textarea name="message" placeholder="Type your message" required></textarea>
            <button type="submit">Send Message</button>
          </form>

          <a
            href="https://www.instagram.com/stephanie.traut.design?igsh=NTQ5Ymo2MzVqbTBv"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-icon"
          >
            <FaInstagram size={24} />
          </a>
        </div>
      </section>

    </div>
  );
}

// ── Inline styles ─────────────────────────────────────────────────────────────

const toolbarStyle = {
  position: "sticky",
  top: 0,
  zIndex: 9999,
  display: "flex",
  alignItems: "center",
  gap: "1.25rem",
  padding: "0.7rem 1.5rem",
  background: "#111",
  color: "#f0ece4",
  fontFamily: "'DM Mono', 'Courier New', monospace",
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
};

const btnStyle = (bg, color) => ({
  padding: "0.35rem 1rem",
  background: bg,
  color,
  border: "none",
  borderRadius: "2px",
  fontFamily: "inherit",
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  cursor: "pointer",
  transition: "opacity 0.2s",
  whiteSpace: "nowrap",
});

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  zIndex: 99999,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const pickerStyle = {
  background: "#fff",
  borderRadius: "4px",
  padding: "1.5rem",
  width: "min(90vw, 720px)",
  maxHeight: "80vh",
  overflowY: "auto",
};

const pickerGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
  gap: "0.5rem",
};

const pickerImgStyle = {
  width: "100%",
  aspectRatio: "1",
  objectFit: "cover",
  cursor: "pointer",
  borderRadius: "3px",
  transition: "opacity 0.2s, transform 0.15s",
};

const removeBtn = {
  position: "absolute",
  top: "-10px",
  right: "-10px",
  width: "22px",
  height: "22px",
  borderRadius: "50%",
  border: "none",
  background: "#c0392b",
  color: "#fff",
  fontSize: "0.6rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 10,
};

const emptyHint = {
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#aaa",
  fontFamily: "'DM Mono', monospace",
  fontSize: "0.85rem",
  pointerEvents: "none",
  textAlign: "center",
};
