import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import AdminTransactionsPanel from "./AdminTransactionsPanel";

export const dynamic = "force-dynamic";

// NOTE: real route protection (admin-only) happens in the API layer via
// getAuthUser/requireRole. Add middleware.js gating for this page too
// before shipping to production (see README "Hardening" section).
export default async function AdminPage() {
  await connectDB();
  const pending = await Transaction.find({ status: "pending" })
    .populate("user", "name email phone")
    .populate("plan", "name priceInr durationDays")
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="px-6 md:px-14 py-10 max-w-4xl mx-auto">
      <h1 className="font-display text-3xl text-castle-gold mb-2">Admin — UTR Verification</h1>
      <p className="text-castle-muted mb-8">
        Approve a UTR to instantly upgrade that user to Premium and unlock all VIP streams.
      </p>
      <AdminTransactionsPanel initialTransactions={JSON.parse(JSON.stringify(pending))} />
    </div>
  );
}
