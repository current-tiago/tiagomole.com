const { getStore } = require('@netlify/blobs');

// Total number of items in the THINGS array on the client
const TOTAL_ITEMS = 14;

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': 'https://tiagomole.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Returns today's date string in Lisbon time (YYYY-MM-DD)
function todayLisbon() {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Lisbon' });
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };
  }

  let store;
  try {
    store = getStore('lottery');
  } catch (e) {
    return { statusCode: 500, headers: CORS, body: JSON.stringify({ error: 'store unavailable' }) };
  }

  const today = todayLisbon();

  // Fetch today's draw record and the running seen-list in parallel
  const [todayDraw, globalState] = await Promise.all([
    store.get(today,   { type: 'json' }).catch(() => null),
    store.get('state', { type: 'json' }).catch(() => null),
  ]);

  const seenItems = globalState?.seen ?? [];

  // ── Already drawn today — return the stored result to everyone ──
  if (todayDraw) {
    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({
        alreadyDrawn: true,
        won:     todayDraw.won,
        itemIdx: todayDraw.itemIdx ?? null,
        seenItems,
      }),
    };
  }

  // ── First click of the day — roll the dice once, store it ──
  const rolled = Math.random() < 0.25;
  let itemIdx  = null;
  let newSeen  = seenItems;

  if (rolled) {
    const unseen = Array.from({ length: TOTAL_ITEMS }, (_, i) => i)
      .filter(i => !seenItems.includes(i));

    if (unseen.length > 0) {
      itemIdx = unseen[Math.floor(Math.random() * unseen.length)];
      newSeen = [...seenItems, itemIdx];
      // Persist updated seen list
      await store.set('state', JSON.stringify({ seen: newSeen }));
    }
  }

  const won = itemIdx !== null;
  await store.set(today, JSON.stringify({ won, itemIdx }));

  return {
    statusCode: 200,
    headers: CORS,
    body: JSON.stringify({
      alreadyDrawn: false,
      won,
      itemIdx,
      seenItems: newSeen,
    }),
  };
};
