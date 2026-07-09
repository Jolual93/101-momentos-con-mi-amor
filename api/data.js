import { put, list } from '@vercel/blob';

const DATA_PATH = 'data/album.json';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { blobs } = await list({ prefix: DATA_PATH });
      const found = blobs.find((b) => b.pathname === DATA_PATH);
      if (!found) {
        res.status(200).json({});
        return;
      }
      const r = await fetch(found.url, { cache: 'no-store' });
      const json = await r.json();
      res.status(200).json(json);
      return;
    }

    if (req.method === 'POST') {
      const datos = req.body || {};
      await put(DATA_PATH, JSON.stringify(datos), {
        access: 'public',
        contentType: 'application/json',
        allowOverwrite: true,
        addRandomSuffix: false,
      });
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
}
