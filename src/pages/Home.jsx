import "../App.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../sanity";
import emailjs from "emailjs-com";
import { useRef } from "react";

export default function Home({ darkMode, setDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [heroProject, setHeroProject] = useState(null);
  const navigate = useNavigate();
  const form = useRef(); // ✅ added

  // 🔥 NAVBAR SCROLL
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 🔥 FETCH PROJECTS
  useEffect(() => {
    client
      .fetch(`*[_type == "project" && featured == true] | order(order asc){
        _id,
        title,
        category,
        shortDesc,
        timeline,
        team,
        "coverImage": coverImage.asset->url
      }`)
      .then(setProjects);
  }, []);

  useEffect(() => {
  client
    .fetch(`*[_type=="project" && hero==true][0]{
      title,
      "heroImage": coalesce(heroImage.asset->url, coverImage.asset->url)
    }`)
    .then(setHeroProject);
}, []);

  // 🔥 FETCH LOCATIONS
  useEffect(() => {
    client
      .fetch(`*[_type == "project"]{ locations }`)
      .then((data) => {
        const allLocations = data.flatMap(p => p.locations || []);
        setLocations([...new Set(allLocations)]);
      });
  }, []);

  const changeLanguage = (lang) => {
  const select = document.querySelector(".goog-te-combo");
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event("change"));
  }
};

  // 🔥 SCROLL ANIMATION FOR CITIES
  useEffect(() => {
    const items = document.querySelectorAll(".city");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.3 }
    );

    items.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [locations]);

  // ✅ EMAIL FUNCTION (ADDED)
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_yfqxm7b",
        "YOUR_TEMPLATE_ID",
        form.current,
        "YOUR_PUBLIC_KEY"
      )
      .then(
        () => {
          alert("Message sent!");
          form.current.reset();
        },
        () => {
          alert("Failed to send message.");
        }
      );
  };

  if (!projects.length) return <div>Loading...</div>;

  return (
    <div className="home">

      {/* NAVBAR */}
      <header className={`navbar ${scrolled ? "scrolled" : ""}`}>

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

      {/* MENU OVERLAY */}
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

      {/* HERO */}
      <section className="hero">
  <img src={heroProject?.heroImage} alt="hero" />
</section>

      {/* PROJECTS */}
      <section className="projects-showcase">
        {projects.map((project, index) => (
          <div
            className={`showcase-item ${index % 2 !== 0 ? "reverse" : ""}`}
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
          >
           <div
  className="showcase-item"
  key={project._id}
  onClick={() => navigate(`/project/${project._id}`)}
>
  <div className="showcase-img">
    <img src={project.coverImage} alt="" />

    <div className="overlay">
      <h2>{project.title?.en || project.title}</h2>
    </div>
  </div>
</div>
            <div className="showcase-img">
              <img src={project.coverImage} alt="" />
            </div>
          </div>
        ))}
      </section>

      {/* CONTACT */}
      <section className="contact">
        <div className="contact-inner">

          <h1>Get in Touch</h1>
          <p>We’d love to hear from you! Reach out today.</p>

          {/* ✅ ONLY THIS FORM UPDATED */}
          <form
            ref={form}
            onSubmit={sendEmail}
            className="contact-form"
          >

            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
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

        </div>
      </section>

    </div>
  );
}