import "../App.css";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../sanity";
import emailjs from "emailjs-com";
import { Rnd } from "react-rnd";
import { FaInstagram } from "react-icons/fa";

const EDIT_KEY = import.meta.env.VITE_EDIT_KEY || "stephanie2024";

function useEditMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("edit") === "true" && params.get("key") === EDIT_KEY;
}

export default function Home({ darkMode, setDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroProject, setHeroProject] = useState(null);
  const [customLayout, setCustomLayout] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();
  const form = useRef();
  const isEditMode = useEditMode();
  const [canvasHeight, setCanvasHeight] = useState(2000);

  // ── Fetch / init layout ─────────────────────────────────────────────────────
  useEffect(() => {
  const initLayout = async () => {
    try {
      const existing = await client.fetch(`*[_id == "homepageLayout"][0]`);

      if (!existing) {
        await client.createIfNotExists({
          _id: "homepageLayout",
          _type: "layout",
          elements: [],
          canvasHeight: 2000,
        });
      }

      const data = await client.fetch(
        `*[_type == "layout" && _id == "homepageLayout"][0]`
      );

      if (data) {
        setCustomLayout(data.elements || []);
        setCanvasHeight(data.canvasHeight || 2000);
      }
    } catch (err) {
      console.error("Layout init error:", err);
    }
  };

  initLayout();
}, []);

  // ── Fetch all project images for the picker (with project ID) ──────────────
  useEffect(() => {
    client
      .fetch(`*[_type == "project"]{
        _id,
        "images": images[].asset->url,
        "cover": coverImage.asset->url,
        "homepageImages": homepageImages[].asset->url
      }`)
      .then((data) => {
        const imgs = [];
        data.forEach((p) => {
          if (p.cover) imgs.push({ src: p.cover, projectId: p._id });
          if (p.images) p.images.forEach(url => imgs.push({ src: url, projectId: p._id }));
          if (p.homepageImages) p.homepageImages.forEach(url => imgs.push({ src: url, projectId: p._id }));
        });
        // Deduplicate by src
        const seen = new Set();
        setAllImages(imgs.filter(img => {
          if (!img.src || seen.has(img.src)) return false;
          seen.add(img.src);
          return true;
        }));
      });
  }, []);

  // ── Navbar scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Fetch projects ──────────────────────────────────────────────────────────
  useEffect(() => {
    client
      .fetch(`*[_type == "project" && featured == true] | order(order asc){
        _id,
        title,
        category,
        shortDesc,
        "coverImage": coverImage.asset->url,
        "images": images[].asset->url,
        "homepageImages": homepageImages[].asset->url
      }`)
      .then(setProjects);
  }, []);

  // ── Fetch hero project ──────────────────────────────────────────────────────
  useEffect(() => {
    client
      .fetch(`*[_type=="project" && hero==true][0]{
        title,
        "heroImage": coalesce(heroImage.asset->url, coverImage.asset->url)
      }`)
      .then(setHeroProject);
  }, []);

  // ── Fetch locations ─────────────────────────────────────────────────────────
  useEffect(() => {
    client
      .fetch(`*[_type == "project"]{ locations }`)
      .then((data) => {
        const allLocations = data.flatMap((p) => p.locations || []);
        setLocations([...new Set(allLocations)]);
      });
  }, []);

  // ── City scroll animation ───────────────────────────────────────────────────
  useEffect(() => {
    const items = document.querySelectorAll(".city");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.3 }
    );
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [locations]);

  // ── Canvas helpers ──────────────────────────────────────────────────────────
  const handleUpdate = (index, updatedItem) => {
    const updatedLayout = [...customLayout];
    updatedLayout[index] = updatedItem;
    setCustomLayout(updatedLayout);
    setSaved(false);
  };

  const addImageToCanvas = ({ src, projectId }) => {
    const newElement = {
      _key: Date.now().toString(),
      x: 80,
      y: 80,
      width: 300,
      height: 300,
      src,
      projectId,
      zIndex: (customLayout?.length || 0) + 1,
    };
    setCustomLayout((prev) => [...(prev || []), newElement]);
    setShowPicker(false);
    setSaved(false);
  };

  const removeElement = (index) => {
    setCustomLayout((prev) => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const saveLayout = async () => {
    setSaving(true);
    try {
      await client
        .patch("homepageLayout")
        .set({ elements: customLayout, canvasHeight  })
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
      .sendForm("service_yfqxm7b", "YOUR_TEMPLATE_ID", form.current, "YOUR_PUBLIC_KEY")
      .then(
        () => { alert("Message sent!"); form.current.reset(); },
        () => { alert("Failed to send message."); }
      );
  };

  if (!projects.length) return <div>Loading...</div>;

  return (
    <div className="home">

      {/* ── NAVBAR ── */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="logo" onClick={() => navigate("/")}>Stephanie Traut</div>

        <nav className="nav-links">
          <a onClick={() => navigate("/set")}>Set</a>
          <a onClick={() => navigate("/stage")}>Stage</a>
          <a onClick={() => navigate("/costume")}>Costume</a>
          <a onClick={() => navigate("/about")}>About</a>
          <a onClick={() => navigate("/contact")}>Contact</a>
        </nav>

        <div className="nav-right">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
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

      {/* ── MENU OVERLAY ── */}
      {menuOpen && (
        <div className="menu-overlay">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
          <div className="menu-links">
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/set")}>Set</button>
            <button onClick={() => navigate("/costume")}>Costume</button>
            <button onClick={() => navigate("/stage")}>Stage</button>
            <button onClick={() => navigate("/about")}>About</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="hero">
        <img src={heroProject?.heroImage} alt="hero" />
      </section>

      {/* ── EDIT MODE TOOLBAR ── */}
      {isEditMode && (
  <div style={toolbarStyle}>
    <span style={{ fontWeight: 600, color: "#d4c5a9", letterSpacing: "0.08em" }}>
      ✦ Edit Mode
    </span>
    <span style={{ opacity: 0.55, fontSize: "0.7rem" }}>
      Drag to move · Corner to resize · Click ✕ to remove
    </span>
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <span style={{ color: "#d4c5a9", fontSize: "0.7rem" }}>Height:</span>
      <button
        style={btnStyle("#3a3a3a", "#d4c5a9")}
        onClick={() => setCanvasHeight(h => Math.max(500, h - 500))}
      >− Shorter</button>
      <span style={{ color: "#fff", fontSize: "0.7rem" }}>{canvasHeight}px</span>
      <button
        style={btnStyle("#3a3a3a", "#d4c5a9")}
        onClick={() => setCanvasHeight(h => h + 500)}
      >+ Taller</button>
    </div>
    <div style={{ display: "flex", gap: "0.75rem", marginLeft: "auto" }}>
      <button
        style={btnStyle("#3a3a3a", "#d4c5a9")}
        onClick={() => setShowPicker(true)}
      >
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
                Pick an Image
              </h3>
              <button style={btnStyle("#eee", "#333")} onClick={() => setShowPicker(false)}>✕ Close</button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#888", marginBottom: "1rem", fontFamily: "monospace" }}>
              {allImages.length} images from your Sanity projects
            </p>
            <div style={pickerGridStyle}>
              {allImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt=""
                  style={pickerImgStyle}
                  onClick={() => addImageToCanvas(img)}
                  onMouseEnter={(e) => { e.target.style.opacity = "0.75"; e.target.style.transform = "scale(0.97)"; }}
                  onMouseLeave={(e) => { e.target.style.opacity = "1"; e.target.style.transform = "scale(1)"; }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── CANVAS SECTION ── */}
      <section className="projects-showcase">
        {customLayout !== null ? (
          <div style={{ position: "relative", height: `${canvasHeight}px` }}>
            {customLayout.map((el, i) => (
              <Rnd
                key={el._key || i}
                size={{ width: el.width || 200, height: el.height || 200 }}
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
                <div
  style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
  onMouseEnter={e => {
    if (isEditMode) return;
    e.currentTarget.querySelector('img').style.transform = 'scale(1.05)';
    e.currentTarget.querySelector('.hover-overlay').style.opacity = '1';
  }}
  onMouseLeave={e => {
    if (isEditMode) return;
    e.currentTarget.querySelector('img').style.transform = 'scale(1)';
    e.currentTarget.querySelector('.hover-overlay').style.opacity = '0';
  }}
>
  <img
    src={el.src}
    alt=""
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
      cursor: !isEditMode && el.projectId ? "pointer" : "default",
      transition: "transform 0.4s ease",
    }}
    draggable={false}
    onClick={() => {
      if (!isEditMode && el.projectId) navigate(`/project/${el.projectId}`);
    }}
  />
  {!isEditMode && (
    <div
      className="hover-overlay"
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0,
        transition: "opacity 0.3s ease",
        cursor: el.projectId ? "pointer" : "default",
      }}
      onClick={() => {
        if (el.projectId) navigate(`/project/${el.projectId}`);
      }}
    >
      <span style={{
        color: "#fff",
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "1.25rem",
        fontWeight: 300,
        letterSpacing: "0.12em",
        textAlign: "center",
        padding: "0 1rem",
        textTransform: "uppercase",
      }}>
        {projects.find(p => p._id === el.projectId)?.title || ""}
      </span>
    </div>
  )}
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

            {customLayout.length === 0 && isEditMode && (
              <div style={emptyHint}>
                Click <strong>+ Add Image</strong> to place your first image on the canvas.
              </div>
            )}
          </div>
        ) : (
          /* Fallback while loading */
          <div className="home-projects">
            {projects.map((project, index) => (
              <div
                className={`showcase-item ${index % 2 !== 0 ? "reverse" : ""}`}
                key={project._id}
                onClick={() => navigate(`/project/${project._id}`)}
              >
                <div className="showcase-img main-img">
                  <img src={project.coverImage} alt="" />
                </div>
                <div className="showcase-collage">
                  {project.homepageImages?.map((img, i) => (
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── CONTACT ── */}
      <section className="contact">
        <div className="contact-inner">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you! Reach out today.</p>

          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <label>Name</label>
            <input type="text" name="name" placeholder="Enter your name" required />
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" required />
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
