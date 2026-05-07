import "./App.css";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SetPage from "./pages/SetPage";
import StagePage from "./pages/StagePage";
import CostumePage from "./pages/CostumePage";
import AboutPage from "./pages/AboutPage";
import ProjectDetail from "./pages/ProjectDetails";
import Contact from "./pages/Contact";
import { LanguageProvider } from "./context/LanguageContext";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <LanguageProvider>
      <div className={darkMode ? "dark" : "light"}>
        <Routes>
          <Route path="/" element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/set" element={<SetPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/costume" element={<CostumePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/stage" element={<StagePage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/about" element={<AboutPage darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/project/:id" element={<ProjectDetail darkMode={darkMode} setDarkMode={setDarkMode} />} />
          <Route path="/contact" element={<Contact darkMode={darkMode} setDarkMode={setDarkMode} />} />
        </Routes>
      </div>
    </LanguageProvider>
  );
}