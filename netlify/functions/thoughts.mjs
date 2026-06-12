import { getStore } from '@netlify/blobs';

// Daily thoughts: POST from Tiago's phone (iOS Shortcut), GET from Rocky's Home.
// Today's thoughts stay hidden until REVEAL_HOUR Lisbon time; older ones always show.
const REVEAL_HOUR = 14;

function lisbonNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hour12: false,
  }).formatToParts(new Date());
  const o = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { date: `${o.year}-${o.month}-${o.day}`, hour: parseInt(o.hour, 10) };
}

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export default async (req) => {
  const writeToken = process.env.THOUGHTS_WRITE_TOKEN;
  const readKey = process.env.THOUGHTS_READ_KEY;
  if (!writeToken || !readKey) return json({ ok: false }, 500);

  const store = getStore('thoughts');

  if (req.method === 'POST') {
    const body = await req.json().catch(() => null);
    if (!body || !body.token || body.token !== writeToken) return json({ ok: false }, 401);
    const text = String(body.text || '').trim().slice(0, 2000);
    if (!text) return json({ ok: false }, 400);

    const list = (await store.get('list', { type: 'json' })) || [];
    list.push({ d: lisbonNow().date, t: text, ts: Date.now() });
    await store.setJSON('list', list);
    return json({ ok: true, saved: text.slice(0, 80) });
  }

  if (req.method === 'GET') {
    const key = new URL(req.url).searchParams.get('k');
    if (!key || key !== readKey) return json({ ok: false }, 401);

    const list = (await store.get('list', { type: 'json' })) || [];
    const { date, hour } = lisbonNow();
    const visible = list
      .filter(e => e.d < date || (e.d === date && hour >= REVEAL_HOUR))
      .sort((a, b) => b.ts - a.ts);
    return json({ ok: true, thoughts: visible.map(e => ({ d: e.d, t: e.t })) });
  }

  return json({ ok: false }, 405);
};
