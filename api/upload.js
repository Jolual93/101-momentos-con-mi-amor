import { put } from '@vercel/blob';
import { slugify } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { key, dataUrl } = req.body || {};
    if (!key || !dataUrl) {
      res.status(400).json({ error: 'Falta key o dataUrl' });
      return;
    }

    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(dataUrl);
    if (!match) {
      res.status(400).json({ error: 'Formato de imagen inválido' });
      return;
    }

    const contentType = match[1];
    const buffer = Buffer.from(match[2], 'base64');
    const safeKey = slugify(key);

    const blob = await put(`photos/${safeKey}.jpg`, buffer, {
      access: 'public',
      contentType,
      allowOverwrite: true,
      addRandomSuffix: false,
    });

    // cache-bust so a "cambiar foto" shows immediately even though the
    // underlying blob path/URL stays the same
    res.status(200).json({ url: `${blob.url}?v=${Date.now()}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
}
