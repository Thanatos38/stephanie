import "../App.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { useTranslate } from "../hooks/Usetranslation";

export default function Contact({ darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  // ── Static text translations ─────────────────────────────────────────────
  const tTitle = useTranslate("Get in Touch");
  const tSubtitle = useTranslate("Let's collaborate and bring your creative vision to life.");
  const tName = useTranslate("Your Name");
  const tEmail = useTranslate("Your Email");
  const tMessage = useTranslate("Your Message");
  const tSend = useTranslate("Send Message");
  const tSuccess = useTranslate("Message sent successfully!");
  const tError = useTranslate("Something went wrong. Please try again.");
  const tContactInfo = useTranslate("Contact Information");
  const tLocation = useTranslate("Location");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const response = await fetch("https://formspree.io/f/xbdqeqra", {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    });
    if (response.ok) { setStatus("success"); form.reset(); }
    else { setStatus("error"); }
  };

  return (
    <div className={`contact-page ${darkMode ? "dark" : "light"}`}>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} alwaysScrolled />

      {/* HEADER */}
      <section className="contact-header">
        <h1>{tTitle}</h1>
        <p>{tSubtitle}</p>
      </section>

      {/* MAIN SECTION */}
      <section className="contact-container">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder={tName} required />
          <input type="email" name="email" placeholder={tEmail} required />
          <textarea name="message" placeholder={tMessage} required></textarea>
          <button type="submit">{tSend}</button>
          {status === "success" && <p style={{ color: "green", marginTop: "10px" }}>✓ {tSuccess}</p>}
          {status === "error" && <p style={{ color: "red", marginTop: "10px" }}>{tError}</p>}
        </form>

        <div className="contact-info">
          <h3>{tContactInfo}</h3>
          <p><strong>Email:</strong> hello@costumecraft.com</p>
          <p><strong>Phone:</strong> +91 98765 43210</p>
          <p><strong>{tLocation}:</strong> Pune, India</p>
        </div>
      </section>

    </div>
  );
}