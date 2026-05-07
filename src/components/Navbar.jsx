// src/components/Navbar.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/Languagecontext";
import { useTranslate } from "../hooks/Usetranslation";

export default function Navbar({
  darkMode,
  setDarkMode,
  scrolled = false,
  alwaysScrolled = false,
}) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const { lang, switchLanguage, translating } = useLang();

  // ── Translations ─────────────────────────────────────────
  const tHome = useTranslate("Home");
  const tSet = useTranslate("Set");
  const tStage = useTranslate("Stage");
  const tCostume = useTranslate("Costume");
  const tAbout = useTranslate("About");
  const tContact = useTranslate("Contact");

  return (
    <>
      <header
        className={`navbar ${
          scrolled || alwaysScrolled ? "scrolled" : ""
        }`}
      >
        <div className="logo" onClick={() => navigate("/")}>
          Stephanie Traut
        </div>

        <nav className="nav-links">
          <a onClick={() => navigate("/set")}>
            {tSet}
          </a>

          <a onClick={() => navigate("/stage")}>
            {tStage}
          </a>

          <a onClick={() => navigate("/costume")}>
            {tCostume}
          </a>

          <a onClick={() => navigate("/about")}>
            {tAbout}
          </a>

          <a onClick={() => navigate("/contact")}>
            {tContact}
          </a>
        </nav>

        <div className="nav-right">

          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className={`toggle-track ${darkMode ? "dark" : ""}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>

          <div className="lang-switch">

            <button
              onClick={() => switchLanguage("EN")}
              style={{
                fontWeight: lang === "EN" ? 700 : 400,
                opacity: translating ? 0.5 : 1,
              }}
            >
              EN
            </button>

            <button
              onClick={() => switchLanguage("DE")}
              style={{
                fontWeight: lang === "DE" ? 700 : 400,
                opacity: translating ? 0.5 : 1,
              }}
            >
              {translating ? "…" : "DE"}
            </button>

          </div>

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

      {menuOpen && (
        <div className="menu-overlay">

          <button
            className="close-btn"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>

          <div className="menu-links">

            <button
              onClick={() => {
                navigate("/");
                setMenuOpen(false);
              }}
            >
              {tHome}
            </button>

            <button
              onClick={() => {
                navigate("/set");
                setMenuOpen(false);
              }}
            >
              {tSet}
            </button>

            <button
              onClick={() => {
                navigate("/costume");
                setMenuOpen(false);
              }}
            >
              {tCostume}
            </button>

            <button
              onClick={() => {
                navigate("/stage");
                setMenuOpen(false);
              }}
            >
              {tStage}
            </button>

            <button
              onClick={() => {
                navigate("/about");
                setMenuOpen(false);
              }}
            >
              {tAbout}
            </button>

            <button
              onClick={() => {
                navigate("/contact");
                setMenuOpen(false);
              }}
            >
              {tContact}
            </button>

          </div>
        </div>
      )}
    </>
  );
}