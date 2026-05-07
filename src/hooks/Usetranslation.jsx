// src/hooks/useTranslation.js
// Use this hook in any component to translate dynamic content

import { useState, useEffect } from "react";
import { useLang } from "../context/LanguageContext";

// Translate a single string
export function useTranslate(text) {
  const { lang, translateText } = useLang();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    if (!text) return;
    if (lang === "EN") {
      setTranslated(text);
      return;
    }
    translateText(text, lang).then(setTranslated);
  }, [text, lang]);

  return translated;
}

// Translate an entire object's string values
export function useTranslateObject(obj, keys) {
  const { lang, translateText } = useLang();
  const [translated, setTranslated] = useState(obj);

  useEffect(() => {
    if (!obj) return;
    if (lang === "EN") {
      setTranslated(obj);
      return;
    }

    const translate = async () => {
      const result = { ...obj };
      for (const key of keys) {
        if (obj[key]) {
          result[key] = await translateText(obj[key], lang);
        }
      }
      setTranslated(result);
    };

    translate();
  }, [obj, lang]);

  return translated;
}

// Translate an array of objects
export function useTranslateArray(arr, keys) {
  const { lang, translateText } = useLang();
  const [translated, setTranslated] = useState(arr);

  useEffect(() => {
    if (!arr || arr.length === 0) return;
    if (lang === "EN") {
      setTranslated(arr);
      return;
    }

    const translateAll = async () => {
      const results = await Promise.all(
        arr.map(async (item) => {
          const result = { ...item };
          for (const key of keys) {
            if (item[key]) {
              result[key] = await translateText(item[key], lang);
            }
          }
          return result;
        })
      );
      setTranslated(results);
    };

    translateAll();
  }, [arr, lang]);

  return translated;
}