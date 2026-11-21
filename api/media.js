import { put, fail } from './_store.js';

// POST /api/media?name=<file name>   body = the raw file
// Vercel limits request bodies to ~4.5 MB, so files must be smaller than that.
export async function POST(request) {
  try {
    const url = new URL(request.url);
    const name = (url.searchParams.get('name') || 'file').replace(/[^\w.\-]+/g, '_').slice(-80);
    const type = request.headers.get('content-type') || 'application/octet-stream';
    if (!/^(image|audio)\//.test(type) && type !== 'application/octet-stream' && type !== 'application/ogg') {
      return Response.json({ error: 'Only pictures and sounds' }, { status: 400 });
    }
    const buf = Buffer.from(await request.arrayBuffer());
    if (!buf.length) return Response.json({ error: 'Empty file' }, { status: 400 });
    const blob = await put(`media/${Date.now()}-${name}`, buf, {
      access: 'public', contentType: type, addRandomSuffix: true,
    });
    return Response.json({ url: blob.url });
  } catch (e) { return fail(e); }
}
