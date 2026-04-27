import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";

export default function AboutPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

 useEffect(() => {
  client.fetch(`*[_type=="project" && showInTimeline==true && defined(date)] 
  | order(date desc){
    _id,
    title,
    date,  // 👈 safest version
    shortDesc,
    "coverImage": coverImage.asset->url
}`)
    .then(setTimeline);
}, []);
const formattedTimeline = timeline.map(item => ({
  ...item,
  year: item.date ? item.date.split("-")[0] : null
}));

const groupedTimeline = formattedTimeline
  .filter(item => item.year)
  .reduce((acc, item) => {
    if (!acc[item.year]) acc[item.year] = [];

    if (acc[item.year].length < 3) {
      acc[item.year].push(item);
    }

    return acc;
  }, {});

  const changeLanguage = (lang) => {
  if (lang === "en") return;

  const url = window.location.origin;

  window.open(
    `https://translate.google.com/translate?sl=en&tl=de&u=${encodeURIComponent(url)}`,
    "_blank"
  );
};

  return (
    <div className={`about-page ${darkMode ? "dark" : "light"}`}>

      

      {/* NAVBAR */}
      <header className="navbar scrolled">

        {menuOpen && (
  <div className="menu-overlay">
    <button className="close-btn" onClick={() => setMenuOpen(false)}>
      ✕
    </button>

    <div className="menu-links">
      <button onClick={() => { navigate("/"); setMenuOpen(false); }}>Home</button>
      <button onClick={() => { navigate("/about"); setMenuOpen(false); }}>About</button>
      <button onClick={() => { navigate("/set"); setMenuOpen(false); }}>Set</button>
      <button onClick={() => { navigate("/costume"); setMenuOpen(false); }}>Costume</button>
      <button onClick={() => { navigate("/stage"); setMenuOpen(false); }}>Stage</button>
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

      {/* HERO */}
      <section className="about-hero-new">
        <div className="about-hero-image">
          <img src="/images/Steph.jpeg" alt="Stephanie Traut" />
        </div>

        <div className="about-hero-text">
          <p className="about-label">Production Designer</p>
          <h1>
            Stephanie<br />Traut
          </h1>
          <p className="about-bio">
            We design cinematic environments and immersive worlds through
            production design, combining storytelling with visual artistry.
          </p>
        </div>
      </section>

      {/* DIVIDER */}
      <div className="about-divider" />

      {/* TIMELINE */}
     <section className="about-timeline-new">
  <div className="timeline-header">
    <p className="timeline-label">Experience</p>
  </div>

  <div className="timeline-list">
    {Object.entries(groupedTimeline)
  .sort((a, b) => b[0] - a[0]) // 👈 sort years DESC
  .map(([year, projects]) => (
      <div className="timeline-entry" key={year}>

        {/* YEAR */}
        <div className="timeline-entry-year">
          {year}
        </div>

        {/* LINE + DOT */}
        <div className="timeline-entry-bar">
          <div className="timeline-dot"></div>
          <div className="timeline-bar-line"></div>
        </div>

        {/* PROJECTS */}
        <div className="timeline-entry-body">
          {projects.map((project) => (
            <div
              key={project._id}
              className="timeline-project"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <h3>{project.title}</h3>
              <p>{project.shortDesc}</p> {/* ✅ FIXED */}
            </div>
          ))}
        </div>

      </div>
    ))}
  </div>
</section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <h3>Stephanie</h3>
          <p>Creating cinematic worlds through design.</p>

          {/* ✅ FIXED INSTAGRAM LINK */}
          <a
            href="https://www.instagram.com/stephanie.traut.design"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-icon"
            style={{ marginTop: "16px", display: "inline-block" }}
          >
            <FaInstagram size={22} />
          </a>
        </div>

        <div className="footer-right">
          <div>
            <h4>Work</h4>
            <p onClick={() => navigate("/set")}>Set Design</p>
            <p onClick={() => navigate("/costume")}>Costume</p>
            <p onClick={() => navigate("/stage")}>Stage</p>
          </div>

          <div>
            <h4>Company</h4>
            <p onClick={() => navigate("/about")}>About</p>
            <p onClick={() => navigate("/contact")}>Contact</p>
          </div>
        </div>
      </footer>

    </div>
  );
}