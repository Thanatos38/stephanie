import "../App.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";
import { useRef } from "react";
import emailjs from "emailjs-com";

export default function ProjectDetail({ darkMode, setDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const form = useRef();
  const [menuOpen, setMenuOpen] = useState(false);
  const [project, setProject] = useState(null);

  // ✅ FIXED LANGUAGE FUNCTION (ONLY CHANGE)
  const changeLanguage = (lang) => {
    if (lang === "en") return;

    const url = window.location.origin;

    window.open(
      "https://translate.google.com/translate?sl=en&tl=de&u=" +
        encodeURIComponent(url),
      "_blank"
    );
  };

  const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      "service_yfqxm7b",
      "template_ymqtwfr",
      form.current,
      "JnaqPcJ-xA1ZrWQep"
    )
    .then(
      () => {
        alert("Message sent successfully!");
        form.current.reset();
      },
      (error) => {
        console.error(error);
        alert("Failed to send message.");
      }
    );
};

  useEffect(() => {
    client.fetch(
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
        "images": images[].asset->url
      }`,
      { id }
    ).then(setProject);
  }, [id]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="project-detail-page">

      {/* NAVBAR */}
      <header className="navbar scrolled">

        {menuOpen && (
  <div className="menu-overlay">
    <button className="close-btn" onClick={() => setMenuOpen(false)}>
      ✕
    </button>

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

  
        <div className="logo" onClick={() => navigate("/")}>
          Stephanie Traut
        </div>

        <nav className="nav-links">
          <a onClick={() => navigate("/set")}>Set</a>
          <a onClick={() => navigate("/stage")}>Stage</a>
          <a onClick={() => navigate("/costume")}>Costume</a>
          <a onClick={() => navigate("/about")}>About</a>
          <a onClick={() => navigate("/contact")}>Contact</a>
        </nav>

        <div className="nav-right">

          {/* THEME TOGGLE */}
          <button
            className="theme-toggle"
            onClick={() => setDarkMode && setDarkMode(!darkMode)}
          >
            <div className={`toggle-track ${darkMode ? "dark" : ""}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>

          <div className="lang-switch">
            <button onClick={() => changeLanguage("en")}>EN</button>
            <button onClick={() => changeLanguage("de")}>DE</button>
          </div>

          {/* HAMBURGER */}
          <div
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </header>

      {/* IMAGE */}
      <section className="project-full-image">
        <img src={project.coverImage} alt="" />
      </section>

      {/* GALLERY */}
     <section className="project-gallery">
  <div className="gallery-grid">
    {project.images?.slice(0, 6).map((img, i) => (
      <img key={i} src={img} alt="" />
    ))}
  </div>
</section>

      {/* 🔥 NEW CLEAN INTRO SECTION */}
      <section className="project-intro">

        {/* LEFT */}
        <div className="intro-left">

          <h1>{project.title}</h1>

          <p className="tagline">
            {project.tagline}
          </p>

          <p className="project-desc">
            {project.shortDesc}
          </p>

        </div>

        {/* RIGHT */}
        <div className="intro-right">

          {project.client && (
  <div>
    <h4>Client</h4>
    <p>{project.client}</p>
  </div>
)}

          {project.date && (
  <div>
    <h4>Date</h4>
    <p>
      {new Date(project.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })}
    </p>
  </div>
)}

         <div>
  <h4>Team</h4>
  {project.team?.map((member, index) => (
    <div key={index} className="team-member">
      <p>
        {member.link ? (
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="team-member-link"
          >
            {member.name}
          </a>
        ) : (
          <span className="member-name">{member.name}</span>
        )}
        {" — "}
        <span className="member-role">{member.role}</span>
      </p>
    </div>
  ))}
</div>

        </div>

      </section>

      {/* DESCRIPTION */}
      <section className="project-longdesc">
        <div className="desc-container">
          <p className="desc-text">{project.longDesc}</p>
        </div>
      </section>

      

      {/* FOOTER */}
      <section className="contact">
        <div className="contact-inner">

          <h1>Get in Touch</h1>
          <p>We’d love to hear from you! Reach out today.</p>

          <form className="contact-form" onSubmit={sendEmail} ref={form}>

  <label>Name</label>
  <input
    type="text"
    name="user_name"
    placeholder="Enter your name"
    required
  />

  <label>Email</label>
  <input
    type="email"
    name="user_email"
    placeholder="Enter your email"
    required
  />

  <label>Message</label>
  <textarea
    name="message"
    placeholder="Type your message"
    required
  ></textarea>

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