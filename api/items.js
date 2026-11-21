import { itemIndex, readJson, put, del, fail } from './_store.js';

const noStore = { 'Cache-Control': 'no-store' };

// GET /api/items -> all buttons
export async function GET() {
  try {
    const index = await itemIndex();
    const items = await Promise.all([...index.values()].map(e => readJson(e.url)));
    return Response.json(items.filter(Boolean), { headers: noStore });
  } catch (e) { return fail(e); }
}

// POST /api/items  { items: [ {id, label, order, image, sound, soundName}, ... ] }
export async function POST(request) {
  try {
    const { items } = await request.json();
    if (!Array.isArray(items) || !items.length) return Response.json({ error: 'No items' }, { status: 400 });
    for (const item of items) {
      if (!item || !/^[\w-]{1,64}$/.test(item.id || '')) return Response.json({ error: 'Bad id' }, { status: 400 });
      const index = await itemIndex(`items/${item.id}-`);
      const prev = index.get(item.id);
      const old = prev ? await readJson(prev.url) : null;

      const clean = {
        id: item.id,
        label: String(item.label || '').slice(0, 40),
        order: Number(item.order) || 0,
        image: String(item.image || ''),
        sound: String(item.sound || ''),
        soundName: String(item.soundName || '').slice(0, 120),
        autoImage: !!item.autoImage,
        trimStart: Number.isFinite(+item.trimStart) && item.trimStart !== null && +item.trimStart > 0 ? +item.trimStart : null,
        trimEnd: Number.isFinite(+item.trimEnd) && item.trimEnd !== null && +item.trimEnd > 0 ? +item.trimEnd : null,
        volume: Math.min(4, Math.max(0, Number.isFinite(+item.volume) ? +item.volume : 1)),
      };
      await put(`items/${item.id}-${Date.now()}.json`, JSON.stringify(clean), {
        access: 'public', contentType: 'application/json', addRandomSuffix: false,
      });

      // Clean up older versions and replaced media files
      const trash = prev ? [...prev.all] : [];
      if (old && old.image && old.image !== clean.image) trash.push(old.image);
      if (old && old.sound && old.sound !== clean.sound) trash.push(old.sound);
      if (trash.length) await del(trash).catch(() => {});
    }
    return Response.json({ ok: true });
  } catch (e) { return fail(e); }
}

// DELETE /api/items?id=<id>
export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get('id') || '';
    if (!/^[\w-]{1,64}$/.test(id)) return Response.json({ error: 'Bad id' }, { status: 400 });
    const index = await itemIndex(`items/${id}-`);
    const e = index.get(id);
    if (!e) return Response.json({ ok: true });
    const item = await readJson(e.url);
    const trash = [...e.all];
    if (item && item.image) trash.push(item.image);
    if (item && item.sound) trash.push(item.sound);
    await del(trash);
    return Response.json({ ok: true });
  } catch (e) { return fail(e); }
}
