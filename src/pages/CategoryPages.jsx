import "../App.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../sanity";
export default function CategoryPage({ category, title, subtitle, darkMode, setDarkMode }) {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
  const handleScroll = () => {
    setScrolled(window.scrollY > 50);
  };

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
       {/* NAV */}<header className="navbar scrolled">
      

        {/* LEFT LOGO */}
        <div className="logo" onClick={() => navigate("/")}>
          Stephanie
        </div>

        {/* CENTER MENU */}
        <nav className="nav-links">
          <a onClick={() => navigate("/about")}>About</a>
          <a onClick={() => navigate("/set")}>Set</a>
          <a onClick={() => navigate("/costume")}>Costume</a>
          <a onClick={() => navigate("/stage")}>Stage</a>
          <a onClick={() => navigate("/contact")}>Contact</a>
        </nav>

        {/* THEME TOGGLE */}
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
      {menuOpen && (
  <div className="menu-overlay">

    <button className="close-btn" onClick={() => setMenuOpen(false)}>
      ✕
    </button>

    <div className="menu-links">
      <button onClick={() => navigate("/")}>Home</button>
      <button onClick={() => navigate("/about")}>About</button>
      <button onClick={() => navigate("/set")}>Set</button>
      <button onClick={() => navigate("/costume")}>Costume</button>
      <button onClick={() => navigate("/stage")}>Stage</button>
      <button onClick={() => navigate("/contact")}>Contact</button>
    </div>

  </div>
)}

      {/* HEADER */}
      <div className="category-header">
        <h1>{title}</h1>
        <p className="tagline">{subtitle}</p>
      </div>

      {/* GRID */}
      <div className="category-grid">
        {projects.map((project) => (
          <div
            key={project._id}
            className="category-card"
            onClick={() => navigate(`/project/${project._id}`)}
          >

            <img src={project.coverImage} alt="" />

            {/* 🔥 HOVER OVERLAY */}
            <div className="overlay">
              <h2>{project.title}</h2>
              <p>{project.tagline}</p>
            </div>

          </div>
        ))}
      </div>

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

  </div>

</section>

    </div>
  );
}