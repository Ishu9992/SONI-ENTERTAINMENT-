"use client";

import { useState } from "react";

export default function AdminTransactionsPanel({ initialTransactions }) {
  const [txns, setTxns] = useState(initialTransactions);
  const [busyId, setBusyId] = useState(null);

  async function review(id, action) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/transactions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTxns((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert(err.message);
    } finally {
      setBusyId(null);
    }
  }

  if (txns.length === 0) {
    return <p className="text-castle-muted">No pending payments — the queue is clear.</p>;
  }

  return (
    <div className="space-y-4">
      {txns.map((t) => (
        <div key={t._id} className="bg-castle-surface rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{t.user?.name} <span className="text-castle-muted font-normal">— {t.user?.email || t.user?.phone}</span></p>
            <p className="text-sm text-castle-muted">
              {t.plan?.name} · ₹{t.amountInr} · UTR: <span className="font-mono text-castle-gold">{t.utr}</span>
            </p>
            {t.screenshotUrl && (
              <a href={t.screenshotUrl} target="_blank" rel="noreferrer" className="text-xs text-castle-amethyst underline">
                View screenshot
              </a>
            )}
          </div>
          <div className="flex gap-2">
            <button
              disabled={busyId === t._id}
              onClick={() => review(t._id, "approve")}
              className="bg-castle-gold text-castle-bg text-sm font-semibold px-4 py-2 rounded disabled:opacity-50"
            >
              Approve
            </button>
            <button
              disabled={busyId === t._id}
              onClick={() => review(t._id, "reject")}
              className="bg-white/10 text-castle-ink text-sm font-semibold px-4 py-2 rounded disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
