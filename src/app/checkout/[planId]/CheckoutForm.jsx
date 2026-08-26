"use client";

import { useState } from "react";

// Step 3 of the UPI flow: the user reports their UTR / transaction ref
// after paying manually. This always creates a "pending" Transaction —
// nothing here auto-verifies a payment.
export default function CheckoutForm({ planId, planName, upiId }) {
  const [utr, setUtr] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | done | error
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, utr, screenshotUrl: screenshotUrl || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
      setMessage(data.message);
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  }

  if (status === "done") {
    return (
      <div className="bg-castle-surface rounded-xl p-6">
        <p className="text-castle-gold font-semibold mb-2">Submitted — Pending Verification</p>
        <p className="text-sm text-castle-muted">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-castle-surface rounded-xl p-6 space-y-4">
      <div>
        <p className="text-sm mb-1">Step 1</p>
        <p className="text-castle-muted text-sm">
          Pay <span className="text-castle-gold font-mono">{upiId}</span> using the QR or UPI app.
        </p>
      </div>

      <label className="block">
        <span className="text-sm mb-1 block">UTR / Transaction Reference ID</span>
        <input
          required
          value={utr}
          onChange={(e) => setUtr(e.target.value)}
          placeholder="e.g. 402913847562"
          className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold"
        />
      </label>

      <label className="block">
        <span className="text-sm mb-1 block">Payment screenshot URL (optional)</span>
        <input
          value={screenshotUrl}
          onChange={(e) => setScreenshotUrl(e.target.value)}
          placeholder="https://..."
          className="w-full rounded bg-castle-surface2 border border-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-castle-gold"
        />
        <span className="text-[11px] text-castle-muted">
          Upload the screenshot to your storage (e.g. Cloudflare R2 / S3) first, then paste its URL here.
        </span>
      </label>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting..." : `Confirm ${planName} payment`}
      </button>

      {status === "error" && <p className="text-castle-live text-sm">{message}</p>}
    </form>
  );
}
