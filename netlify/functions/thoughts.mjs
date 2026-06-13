import { getStore } from '@netlify/blobs';

// Daily thoughts: POST from Tiago's phone (iOS Shortcut), GET from Rocky's Home.
// Thoughts are revealed in nightly batches at REVEAL_HOUR (21:00) Lisbon time.
// Each evening's batch covers the window from the PREVIOUS 21:00 up to this 21:00 —
// i.e. after 9pm you see everything written since yesterday 9pm, up to 9pm today.
// A thought written after 9pm waits for the next night's reveal.
// Older batches stay stored in the blob but are never returned.
const REVEAL_HOUR = 21;

// Lisbon wall-clock date (YYYY-MM-DD) and hour for any Date.
function lisbonParts(dateObj) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', hour12: false,
  }).formatToParts(dateObj);
  const o = Object.fromEntries(parts.map(p => [p.type, p.value]));
  return { date: `${o.year}-${o.month}-${o.day}`, hour: parseInt(o.hour, 10) };
}
const lisbonNow = () => lisbonParts(new Date());

// Date-label arithmetic (treats the string as a pure calendar date).
function addDay(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// The reveal date a thought belongs to: written before 9pm → revealed that same
// evening; written at/after 9pm → revealed the next evening.
function revealDateOf(ts) {
  const { date, hour } = lisbonParts(new Date(ts));
  return hour >= REVEAL_HOUR ? addDay(date, 1) : date;
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

    // Admin ops (token-gated): {op:'clear'} wipes everything; {op:'undo'} removes the latest entry
    if (body.op === 'clear') {
      await store.setJSON('list', []);
      return json({ ok: true, cleared: true });
    }
    if (body.op === 'undo') {
      const list = (await store.get('list', { type: 'json' })) || [];
      const removed = list.pop();
      await store.setJSON('list', list);
      return json({ ok: true, removed: removed ? removed.t.slice(0, 80) : null });
    }

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
    const preview = new URL(req.url).searchParams.get('preview') === '1';

    // Before 9pm: nothing yet (the page shows the "tonight, at nine" teaser).
    // After 9pm: tonight's batch — everything whose reveal date is today, i.e.
    // written since yesterday 9pm up to 9pm today. Anything written after 9pm
    // tonight rolls into tomorrow's batch.
    // ?preview=1 (Tiago only — never sent by the page) shows the batch that the
    // NEXT 9pm reveal will contain, so the pipeline can be tested any time of day.
    const targetDate = preview ? (hour >= REVEAL_HOUR ? addDay(date, 1) : date) : date;
    const visible = (preview || hour >= REVEAL_HOUR)
      ? list.filter(e => revealDateOf(e.ts) === targetDate).sort((a, b) => b.ts - a.ts)
      : [];
    const hhmm = ts => new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Lisbon', hour: '2-digit', minute: '2-digit', hour12: false,
    }).format(new Date(ts));
    return json({ ok: true, thoughts: visible.map(e => ({ d: e.d, t: e.t, h: hhmm(e.ts) })) });
  }

  return json({ ok: false }, 405);
};
