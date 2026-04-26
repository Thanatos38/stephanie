import "../App.css";
import { useNavigate } from "react-router-dom";

const timeline = [
  {
    year: "2024",
    items: ["Lead Costume Designer - DNEG", "Worked on major film production"]
  },
  {
    year: "2022",
    items: ["Senior Designer", "Collaborated with global studios"]
  },
  {
    year: "2020",
    items: ["Joined DNEG", "Worked on initial design projects"]
  }
];

export default function AboutPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();

  return (
    <div className={`about-page ${darkMode ? "dark" : "light"}`}>

      {/* 🔥 NAVBAR (SAME AS HOME) */}
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
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className={`toggle-track ${darkMode ? "dark" : ""}`}>
              <div className="toggle-thumb"></div>
            </div>
          </button>

          {/* HAMBURGER */}
          <div className="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="about-hero">

        <div className="about-img">
          <img src="/images/img1.jpg" alt="profile" />
        </div>

        <div className="about-content">
          <h1>Stephanie Traut</h1>

          <p>
            We design cinematic environments and immersive worlds through
            production design, combining storytelling with visual artistry.
          </p>
        </div>

      </section>

      {/* TIMELINE */}
      <section className="timeline">

        {timeline.map((data, index) => (
          <div className="timeline-row" key={index}>

            <div className="timeline-left">
              <h2>{data.year}</h2>
            </div>

            <div className="timeline-center">
              <div className="dot"></div>
            </div>

            <div className="timeline-right">
              {data.items.map((item, i) => (
                <p key={i}>{item}</p>
              ))}
            </div>

          </div>
        ))}

      </section>

      {/* 🔥 FOOTER (IMPROVED) */}
      <footer className="footer">

        <div className="footer-left">
          <h3>Stephanie</h3>
          <p>Creating cinematic worlds through design.</p>
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