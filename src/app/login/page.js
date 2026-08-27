"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleEmailLogin(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed.");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleSendOtp(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not send OTP.");
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Incorrect code.");
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="px-6 py-16 max-w-md mx-auto">
      <h1 className="font-display text-3xl text-castle-gold mb-2 text-center">Sign In</h1>
      <p className="text-castle-muted text-sm text-center mb-8">Welcome back to Soni Entertainment.</p>

      <div className="flex rounded-full bg-castle-surface2 p-1 mb-6">
        <button onClick={() => { setMode("email"); setError(""); }} className={`flex-1 py-2 text-sm rounded-full transition-colors ${mode === "email" ? "bg-castle-gold text-castle-bg font-semibold" : "text-castle-muted"}`}>Email</button>
        <button onClick={() => { setMode("phone"); setError(""); }} className={`flex-1 py-2 text-sm rounded-full transition-colors ${mode === "phone" ? "bg-castle-gold text-castle-bg font-semibold" : "text-castle-muted"}`}>Phone OTP</button>
      </div>

      {mode === "email" && (
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
          <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
          <button type="submit" disabled={busy} className="w-full bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors disabled:opacity-60">{busy ? "Signing in..." : "Sign In"}</button>
        </form>
      )}

      {mode === "phone" && !otpSent && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input type="tel" required placeholder="+91XXXXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
          <button type="submit" disabled={busy} className="w-full bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors disabled:opacity-60">{busy ? "Sending..." : "Send OTP"}</button>
        </form>
      )}

      {mode === "phone" && otpSent && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <p className="text-xs text-castle-muted">OTP sent to {phone}. (Logged in the server console since no SMS provider is configured yet.)</p>
          <input required placeholder="6-digit code" value={code} onChange={(e) => setCode(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold tracking-widest" />
          <button type="submit" disabled={busy} className="w-full bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors disabled:opacity-60">{busy ? "Verifying..." : "Verify & Sign In"}</button>
        </form>
      )}

      {error && <p className="text-castle-live text-sm mt-4 text-center">{error}</p>}

      <p className="text-center text-sm text-castle-muted mt-8">
        New here? <Link href="/signup" className="text-castle-gold">Create an account</Link>
      </p>
    </div>
  );
}
