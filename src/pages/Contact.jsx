import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Contact({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const response = await fetch("https://formspree.io/f/xbdqeqra", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });

    if (response.ok) {
      setStatus("success");
      form.reset();
    } else {
      setStatus("error");
    }
  };

  const changeLanguage = (lang) => {
  if (lang === "en") return;

  const url = window.location.origin;

  window.open(
    `https://translate.google.com/translate?sl=en&tl=de&u=${encodeURIComponent(url)}`,
    "_blank"
  );
};

  return (
    <div className={`contact-page ${darkMode ? "dark" : "light"}`}>

      {/* NAVBAR */}
      <header className="navbar scrolled">

        {menuOpen && (
  <div className="menu-overlay">
    <button className="close-btn" onClick={() => setMenuOpen(false)}>
      ✕
    </button>

    <div className="menu-links">
      <button onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</button>
      <button onClick={() => { navigate("/set"); setMenuOpen(false); }}>Set</button>
      <button onClick={() => { navigate("/stage"); setMenuOpen(false); }}>Stage</button>
      <button onClick={() => { navigate("/costume"); setMenuOpen(false); }}>Costume</button>
      <button onClick={() => { navigate("/about"); setMenuOpen(false); }}>About</button>
      <button onClick={() => { navigate("/contact"); setMenuOpen(false); }}>Contact</button>
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
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
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
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      {/* HEADER */}
      <section className="contact-header">
        <h1>Get in Touch</h1>
        <p>Let's collaborate and bring your creative vision to life.</p>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-container">

        {/* LEFT FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"          
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"         
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"       
            placeholder="Your Message"
            required
          ></textarea>

          <button type="submit">Send Message</button>

          {/* STATUS MESSAGES */}
          {status === "success" && (
            <p style={{ color: "green", marginTop: "10px" }}>
              ✓ Message sent successfully!
            </p>
          )}
          {status === "error" && (
            <p style={{ color: "red", marginTop: "10px" }}>
              Something went wrong. Please try again.
            </p>
          )}

        </form>

        {/* RIGHT INFO */}
        <div className="contact-info">
          <h3>Contact Information</h3>
          <p><strong>Email:</strong> hello@costumecraft.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>Location:</strong> Pune, India</p>
        </div>

      </section>

    </div>
  );
}