export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { text, target_lang } = req.body;

    const response = await fetch(
      "https://api-free.deepl.com/v2/translate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
        },
        body: JSON.stringify({
          text: [text],
          target_lang,
          source_lang: "EN",
        }),
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Translation failed" });
  }
}