// src/components/Navbar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLang } from "../context/Languagecontext";

export default function Navbar({ darkMode, setDarkMode, scrolled = false, alwaysScrolled = false }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, switchLanguage, translating } = useLang();

  return (
    <>
      <header className={`navbar ${scrolled || alwaysScrolled ? "scrolled" : ""}`}>
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
            <span></span><span></span><span></span>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay">
          <button className="close-btn" onClick={() => setMenuOpen(false)}>✕</button>
          <div className="menu-links">
            <button onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</button>
            <button onClick={() => { navigate("/set"); setMenuOpen(false); }}>Set</button>
            <button onClick={() => { navigate("/costume"); setMenuOpen(false); }}>Costume</button>
            <button onClick={() => { navigate("/stage"); setMenuOpen(false); }}>Stage</button>
            <button onClick={() => { navigate("/about"); setMenuOpen(false); }}>About</button>
            <button onClick={() => { navigate("/contact"); setMenuOpen(false); }}>Contact</button>
          </div>
        </div>
      )}
    </>
  );
}