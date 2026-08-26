import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Plan from "@/models/Plan";
import { getAuthUser } from "@/lib/auth";

// POST /api/transactions  { planId, utr, screenshotUrl? }
// Step 3-4 of the UPI flow: user submits their UTR after paying manually.
// Always lands as "pending" — no money movement is verified automatically.
export async function POST(request) {
  await connectDB();
  const authUser = getAuthUser(request);
  if (!authUser) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const { planId, utr, screenshotUrl } = await request.json();
  if (!planId || !utr || utr.trim().length < 4) {
    return NextResponse.json({ error: "Plan and a valid UTR / transaction reference are required." }, { status: 400 });
  }

  const plan = await Plan.findById(planId);
  if (!plan || !plan.isActive) {
    return NextResponse.json({ error: "This plan is not available." }, { status: 404 });
  }

  const txn = await Transaction.create({
    user: authUser.sub,
    plan: plan._id,
    amountInr: plan.priceInr,
    upiId: process.env.NEXT_PUBLIC_UPI_ID || "8076077522@ybl",
    utr: utr.trim(),
    screenshotUrl: screenshotUrl || null,
    status: "pending"
  });

  return NextResponse.json({
    transaction: txn,
    message: "Payment submitted. Your Premium access unlocks automatically once Soni Media Studios verifies the UTR."
  });
}

// GET /api/transactions — the signed-in user's own payment history.
export async function GET(request) {
  await connectDB();
  const authUser = getAuthUser(request);
  if (!authUser) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const txns = await Transaction.find({ user: authUser.sub }).populate("plan").sort({ createdAt: -1 });
  return NextResponse.json({ transactions: txns });
}
