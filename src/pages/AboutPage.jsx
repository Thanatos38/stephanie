import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { client } from "../sanity";
import { FaInstagram } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { useTranslate, useTranslateArray } from "../hooks/Usetranslation";

export default function AboutPage({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [timeline, setTimeline] = useState([]);

  // ── Static text translations ─────────────────────────────────────────────
  const tProduction = useTranslate("Production Designer");
  const tBio = useTranslate("We design cinematic environments and immersive worlds through production design, combining storytelling with visual artistry.");
  const tExperience = useTranslate("Experience");
  const tCreating = useTranslate("Creating cinematic worlds through design.");
  const tWork = useTranslate("Work");
  const tSetDesign = useTranslate("Set Design");
  const tCostume = useTranslate("Costume");
  const tStage = useTranslate("Stage");
  const tCompany = useTranslate("Company");
  const tAbout = useTranslate("About");
  const tContact = useTranslate("Contact");

  useEffect(() => {
    client.fetch(`*[_type=="project" && showInTimeline==true && defined(date)] 
  | order(date desc){
    _id,
    title,
    date,
    category,
    shortDesc,
    "coverImage": coverImage.asset->url
  }`).then(setTimeline);
  }, []);

  // ── Translate timeline content ───────────────────────────────────────────
  const translatedTimeline = useTranslateArray(timeline, ["title", "shortDesc"]);

  const formattedTimeline = translatedTimeline.map(item => ({
    ...item,
    year: item.date ? item.date.split("-")[0] : null
  }));

  const groupedTimeline = formattedTimeline
    .filter(item => item.year)
    .reduce((acc, item) => {
      if (!acc[item.year]) acc[item.year] = [];
      if (acc[item.year].length < 3) acc[item.year].push(item);
      return acc;
    }, {});

  return (
    <div className={`about-page ${darkMode ? "dark" : "light"}`}>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} alwaysScrolled />

      {/* HERO */}
      <section className="about-hero-new">
        <div className="about-hero-image">
          <img src="/images/steph.jpeg" alt="Stephanie Traut" />
        </div>
        <div className="about-hero-text">
          <p className="about-label">{tProduction}</p>
          <h1>Stephanie Traut</h1>
          <p className="about-bio">{tBio}</p>
        </div>
      </section>

      <div className="about-divider" />

      {/* TIMELINE */}
      {/* TIMELINE */}
<section className="about-timeline-new">
  <div className="timeline-header">
    <p className="timeline-label">{tExperience}</p>
  </div>
  <div className="timeline-list">
    {Object.entries(groupedTimeline)
      .sort((a, b) => b[0] - a[0])
      .map(([year, projects]) => (
        <div className="timeline-entry" key={year}>
          <div className="timeline-entry-year">{year}</div>
          <div className="timeline-entry-projects">
            {projects.map((project) => (
              <div
                key={project._id}
                className="timeline-card"
                onClick={() => navigate(`/project/${project._id}`)}
              >
                {project.coverImage && (
                  <div className="timeline-card-image">
                    <img src={project.coverImage} alt={project.title} />
                  </div>
                )}
                <div className="timeline-card-info">
                  <div className="timeline-card-meta">
                    {project.category && (
                      <span className="timeline-card-category">
                        {(Array.isArray(project.category)
                          ? project.category
                          : [project.category]
                        ).map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(" · ")}
                      </span>
                    )}
                    <span className="timeline-card-year">{year}</span>
                  </div>
                  <h3 className="timeline-card-title">{project.title}</h3>
                  {project.shortDesc && (
                    <p className="timeline-card-desc">{project.shortDesc}</p>
                  )}
                  <span className="timeline-card-link">View project →</span>
                </div>
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
          <p>{tCreating}</p>
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
            <h4>{tWork}</h4>
            <p onClick={() => navigate("/set")}>{tSetDesign}</p>
            <p onClick={() => navigate("/costume")}>{tCostume}</p>
            <p onClick={() => navigate("/stage")}>{tStage}</p>
          </div>
          <div>
            <h4>{tCompany}</h4>
            <p onClick={() => navigate("/about")}>{tAbout}</p>
            <p onClick={() => navigate("/contact")}>{tContact}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}