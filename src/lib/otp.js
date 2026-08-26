// Minimal in-memory OTP store for local development / demo purposes.
// Swap for Redis + a real SMS provider (MSG91, Twilio Verify, Firebase
// Auth) in production — routes only depend on sendOtp / verifyOtp.

const store = new Map(); // phone -> { code, expiresAt }

export async function sendOtp(phone) {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  store.set(phone, { code, expiresAt: Date.now() + 5 * 60 * 1000 });

  if (process.env.OTP_PROVIDER_API_KEY) {
    // TODO: call your real SMS provider here.
  } else {
    console.log(`[castle][OTP] ${phone} -> ${code}`);
  }
  return true;
}

export function verifyOtp(phone, code) {
  const entry = store.get(phone);
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return false;
  }
  const ok = entry.code === code;
  if (ok) store.delete(phone);
  return ok;
}
