export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, target_lang } = req.body;

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      auth_key: process.env.DEEPL_API_KEY,
      text,
      target_lang,
      source_lang: 'EN',
    }),
  });

  const data = await response.json();
  res.status(200).json(data);
}