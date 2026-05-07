import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";
import { useLang } from "../context/Languagecontext";
import { useTranslate, useTranslateArray } from "../hooks/Usetranslation";
import Navbar from "../components/Navbar";

export default function CategoryPage({ category, title, subtitle, darkMode, setDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { lang, switchLanguage, translating } = useLang();

  // ── Static translations ────────────────────────────────────────────────────
  const tTitle = useTranslate(title);
  const tSubtitle = useTranslate(subtitle);
  const tGetInTouch = useTranslate("Get in Touch");
  const tReach = useTranslate("We'd love to hear from you! Reach out today.");
  const tName = useTranslate("Enter your name");
  const tEmail = useTranslate("Enter your email");
  const tMessage = useTranslate("Type your message");
  const tSend = useTranslate("Send Message");

  // ── Translate project content ─────────────────────────────────────────────
  const translatedProjects = useTranslateArray(projects, ["title", "tagline"]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type=="project" && category==$category]{
          _id,
          title,
          tagline,
          "coverImage": coverImage.asset->url
        }`,
        { category }
      )
      .then(setProjects);
  }, [category]);

  return (
    <div className="category-page">

      {/* NAVBAR */}
      <Navbar
  darkMode={darkMode}
  setDarkMode={setDarkMode}
  alwaysScrolled
/>
     

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

      {/* HEADER */}
      <div className="category-header">
        <h1>{tTitle}</h1>
        <p className="tagline">{tSubtitle}</p>
      </div>

      {/* GRID */}
      <div className="category-grid">
        {translatedProjects.map((project) => (
          <div
            key={project._id}
            className="category-card"
            onClick={() => navigate(`/project/${project._id}`)}
          >
            <img src={project.coverImage} alt="" />
            <div className="overlay">
              <h2>{project.title}</h2>
              <p>{project.tagline}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT */}
      <section className="contact">
        <div className="contact-inner">
          <h1>{tGetInTouch}</h1>
          <p>{tReach}</p>

          <form className="contact-form">
            <label>{tName}</label>
            <input type="text" placeholder={tName} />
            <label>{tEmail}</label>
            <input type="email" placeholder={tEmail} />
            <label>{tMessage}</label>
            <textarea placeholder={tMessage}></textarea>
            <button type="submit">{tSend}</button>
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