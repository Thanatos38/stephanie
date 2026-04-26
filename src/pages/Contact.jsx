import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const navigate = useNavigate();

  return (
    <div className="contact-page">

      {/* NAVBAR */}
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

        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      {/* HEADER */}
      <section className="contact-header">
        <h1>Get in Touch</h1>
        <p>
          Let’s collaborate and bring your creative vision to life.
        </p>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-container">

        {/* LEFT FORM */}
        <form className="contact-form">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email" />
          <textarea placeholder="Your Message"></textarea>

          <button type="submit">Send Message</button>
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