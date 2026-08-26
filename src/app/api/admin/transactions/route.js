import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { getAuthUser, requireRole } from "@/lib/auth";

// GET /api/admin/transactions?status=pending
// Admin dashboard feed of UTR submissions awaiting manual review.
export async function GET(request) {
  await connectDB();
  const authUser = getAuthUser(request);
  if (!requireRole(authUser, ["admin"])) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const filter = status ? { status } : {};

  const txns = await Transaction.find(filter)
    .populate("user", "name email phone")
    .populate("plan", "name durationDays priceInr")
    .sort({ createdAt: -1 });

  return NextResponse.json({ transactions: txns });
}
