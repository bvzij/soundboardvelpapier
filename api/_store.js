import { list, put, del } from '@vercel/blob';

// Each button is saved as items/<id>-<timestamp>.json (newest wins).
// New file names on every save avoid stale CDN caches.
export const ITEM_RE = /^items\/(.+)-(\d+)\.json$/;

export async function listAll(prefix) {
  const out = [];
  let cursor;
  do {
    const r = await list({ prefix, cursor, limit: 1000 });
    out.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return out;
}

// Map id -> { ts, url, all: [urls of every version] }
export async function itemIndex(prefix = 'items/') {
  const map = new Map();
  for (const b of await listAll(prefix)) {
    const m = b.pathname.match(ITEM_RE);
    if (!m) continue;
    const [, id, ts] = m;
    const e = map.get(id) || { ts: -1, url: null, all: [] };
    e.all.push(b.url);
    if (+ts > e.ts) { e.ts = +ts; e.url = b.url; }
    map.set(id, e);
  }
  return map;
}

export async function readJson(url) {
  try { const r = await fetch(url); return r.ok ? await r.json() : null; }
  catch { return null; }
}

export function fail(e) {
  const msg = String(e && e.message || e);
  const noToken = /token|BLOB_READ_WRITE/i.test(msg);
  return Response.json(
    { error: noToken ? 'Storage not connected — connect a Blob store in Vercel and redeploy.' : msg },
    { status: 500 }
  );
}

export { put, del };
