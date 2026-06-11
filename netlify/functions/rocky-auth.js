const crypto = require('crypto');

// Per-IP failure throttle. In-memory, so it only persists while the function
// instance stays warm — enough to blunt casual brute-forcing.
const failures = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_FAILURES = 10;
const FAIL_DELAY_MS = 500;

function clientIp(event) {
  return (
    event.headers['x-nf-client-connection-ip'] ||
    (event.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    'unknown'
  );
}

function tooManyFailures(ip) {
  const rec = failures.get(ip);
  if (!rec) return false;
  if (Date.now() - rec.first > WINDOW_MS) {
    failures.delete(ip);
    return false;
  }
  return rec.count >= MAX_FAILURES;
}

function recordFailure(ip) {
  const rec = failures.get(ip);
  if (!rec || Date.now() - rec.first > WINDOW_MS) {
    failures.set(ip, { first: Date.now(), count: 1 });
  } else {
    rec.count++;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const passwordHash = process.env.ROCKY_PASSWORD_HASH;
  if (!passwordHash) {
    return { statusCode: 500, body: JSON.stringify({ ok: false }) };
  }

  const ip = clientIp(event);
  if (tooManyFailures(ip)) {
    return {
      statusCode: 429,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  const { password } = body;
  if (!password) {
    return { statusCode: 400, body: JSON.stringify({ ok: false }) };
  }

  const hash = crypto
    .createHash('sha256')
    .update(password.trim().toLowerCase())
    .digest('hex');

  const ok =
    hash.length === passwordHash.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(passwordHash));

  if (!ok) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, FAIL_DELAY_MS));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ok: false }),
    };
  }

  failures.delete(ip);

  const sessionToken = crypto
    .createHmac('sha256', passwordHash)
    .update('rh-session-v1')
    .digest('hex');

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'https://tiagomole.com',
      'Set-Cookie': `rh_session=${sessionToken}; HttpOnly; Secure; SameSite=Strict; Path=/rh-e3f7a92c1d.html; Max-Age=604800`,
    },
    body: JSON.stringify({ ok: true, path: '/rh-e3f7a92c1d.html' }),
  };
};
