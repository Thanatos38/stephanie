// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useCallback, useRef } from "react";

const LanguageContext = createContext();

const DEEPL_API_KEY = import.meta.env.VITE_DEEPL_API_KEY;

// Cache to avoid re-translating same text
const translationCache = {};

async function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || text.trim() === "") return text;
  if (targetLang === "EN") return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache[cacheKey]) return translationCache[cacheKey];

  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, target_lang: targetLang }),
    });

    const data = await response.json();
    const translated = data.translations?.[0]?.text || text;
    translationCache[cacheKey] = translated;
    return translated;
  } catch (err) {
    console.error("DeepL error:", err);
    return text;
  }
}
// Translate multiple texts in one batch
async function translateBatch(texts, targetLang) {
  if (targetLang === "EN") return texts;

  const results = [];
  for (const text of texts) {
    const translated = await translateText(text, targetLang);
    results.push(translated);
  }
  return results;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("EN"); // "EN" or "DE"
  const [translating, setTranslating] = useState(false);

  const switchLanguage = useCallback(async (newLang) => {
    if (newLang === lang) return;
    setTranslating(true);
    setLang(newLang);
    // Small delay to show translating state
    setTimeout(() => setTranslating(false), 800);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, switchLanguage, translating, translateText, translateBatch }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}