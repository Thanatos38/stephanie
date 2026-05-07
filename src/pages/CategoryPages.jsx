import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useTranslate, useTranslateArray } from "../hooks/Usetranslation";

export default function CategoryPage({
  category,
  title,
  subtitle,
  darkMode,
  setDarkMode,
}) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  // ── Static translations ─────────────────────────────────────────────
  const tTitle = useTranslate(title);
  const tSubtitle = useTranslate(subtitle);

  const tGetInTouch = useTranslate("Get in Touch");
  const tReach = useTranslate(
    "We'd love to hear from you! Reach out today."
  );

  const tName = useTranslate("Enter your name");
  const tEmail = useTranslate("Enter your email");
  const tMessage = useTranslate("Type your message");
  const tSend = useTranslate("Send Message");

  // ── Translate project content ──────────────────────────────────────
  const translatedProjects = useTranslateArray(projects, [
    "title",
    "tagline",
  ]);

  // ── Fetch projects ─────────────────────────────────────────────────
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

            <input
              type="text"
              placeholder={tName}
            />

            <label>{tEmail}</label>

            <input
              type="email"
              placeholder={tEmail}
            />

            <label>{tMessage}</label>

            <textarea
              placeholder={tMessage}
            ></textarea>

            <button type="submit">
              {tSend}
            </button>
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