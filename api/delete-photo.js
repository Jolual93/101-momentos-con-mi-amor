import { del } from '@vercel/blob';
import { slugify } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { key } = req.body || {};
    if (!key) {
      res.status(400).json({ error: 'Falta key' });
      return;
    }
    const safeKey = slugify(key);
    await del(`photos/${safeKey}.jpg`);
    res.status(200).json({ ok: true });
  } catch (err) {
    // If the blob doesn't exist this can throw — that's fine, treat as done.
    console.error(err);
    res.status(200).json({ ok: true, note: 'no-op or already deleted' });
  }
}
