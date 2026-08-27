"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create account.");
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
      <h1 className="font-display text-3xl text-castle-gold mb-2 text-center">Create Account</h1>
      <p className="text-castle-muted text-sm text-center mb-8">Join Soni Entertainment.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
        <input type="email" required placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
        <input type="password" required minLength={6} placeholder="Password (min 6 characters)" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold" />
        <button type="submit" disabled={busy} className="w-full bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors disabled:opacity-60">{busy ? "Creating account..." : "Create Account"}</button>
      </form>

      {error && <p className="text-castle-live text-sm mt-4 text-center">{error}</p>}

      <p className="text-center text-sm text-castle-muted mt-8">
        Already have an account? <Link href="/login" className="text-castle-gold">Sign In</Link>
      </p>
    </div>
  );
}
