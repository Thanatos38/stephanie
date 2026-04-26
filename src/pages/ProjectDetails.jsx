import "../App.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";

export default function ProjectDetail({ darkMode, setDarkMode }) {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    client.fetch(
      `*[_type=="project" && _id==$id][0]{
        _id,
        title,
        tagline,
        shortDesc,
        longDesc,
        team,
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

        <div className="logo" onClick={() => navigate("/")}>
          Stephanie
        </div>

        <nav className="nav-links">
          <a onClick={() => navigate("/about")}>About</a>
          <a onClick={() => navigate("/set")}>Set</a>
          <a onClick={() => navigate("/costume")}>Costume</a>
          <a onClick={() => navigate("/stage")}>Stage</a>
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

          <div>
            <h4>Client</h4>
            <p>{project.client}</p>
          </div>

          <div>
            <h4>Date</h4>
            <p>{project.date}</p>
          </div>

          <div>
            <h4>Team</h4>

            {project.team?.map((member, index) => (
              <div key={index} className="team-member">
                <p>
                  <span className="member-name">{member.name}</span> —{" "}
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

      {/* GALLERY */}
      <section className="project-gallery">
        {project.images?.map((img, i) => (
          <img key={i} src={img} alt="" />
        ))}
      </section>

      {/* FOOTER */}
      <section className="contact">
        <div className="contact-inner">

          <h1>Get in Touch</h1>
          <p>We’d love to hear from you! Reach out today.</p>

          <form className="contact-form">

            <label>Name</label>
            <input type="text" placeholder="Enter your name" />

            <label>Email</label>
            <input type="email" placeholder="Enter your email" />

            <label>Message</label>
            <textarea placeholder="Type your message"></textarea>

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