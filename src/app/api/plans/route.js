import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";

// GET /api/plans — public list of subscription tiers for the Plans screen.
export async function GET() {
  await connectDB();
  const plans = await Plan.find({ isActive: true }).sort({ priceInr: 1 });
  return NextResponse.json({ plans });
}
