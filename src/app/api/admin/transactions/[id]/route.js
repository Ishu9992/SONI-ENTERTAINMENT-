import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Plan from "@/models/Plan";
import User from "@/models/User";
import { getAuthUser, requireRole } from "@/lib/auth";

// PATCH /api/admin/transactions/:id  { action: "approve" | "reject", note? }
// This is Ishu's one-click "instantly approve the UTR" action:
//   approve -> upgrades the user to Premium and extends premiumUntil by
//   the plan's durationDays (stacking on top of any remaining time).
export async function PATCH(request, { params }) {
  await connectDB();
  const authUser = getAuthUser(request);
  if (!requireRole(authUser, ["admin"])) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { action, note } = await request.json();
  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action must be 'approve' or 'reject'." }, { status: 400 });
  }

  const txn = await Transaction.findById(params.id);
  if (!txn) return NextResponse.json({ error: "Transaction not found." }, { status: 404 });
  if (txn.status !== "pending") {
    return NextResponse.json({ error: `Transaction already ${txn.status}.` }, { status: 409 });
  }

  txn.status = action === "approve" ? "approved" : "rejected";
  txn.reviewedBy = authUser.sub;
  txn.reviewedAt = new Date();
  txn.adminNote = note || "";
  await txn.save();

  if (action === "approve") {
    const plan = await Plan.findById(txn.plan);
    const user = await User.findById(txn.user);
    const base = user.premiumUntil && user.premiumUntil > new Date() ? user.premiumUntil : new Date();
    user.premiumUntil = new Date(base.getTime() + plan.durationDays * 24 * 60 * 60 * 1000);
    user.role = "premium";
    await user.save();
  }

  return NextResponse.json({ transaction: txn });
}
