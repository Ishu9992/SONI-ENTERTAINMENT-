import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyOtp } from "@/lib/otp";
import { signToken } from "@/lib/auth";

// POST /api/auth/otp/verify  { phone, code, name? }
export async function POST(request) {
  await connectDB();
  const { phone, code, name } = await request.json();

  const ok = verifyOtp(phone, code);
  if (!ok) {
    return NextResponse.json({ error: "Incorrect or expired OTP." }, { status: 401 });
  }

  let user = await User.findOne({ phone });
  if (!user) {
    user = await User.create({ phone, name: name || "Soni Viewer", role: "free" });
  }

  const token = signToken(user);
  const res = NextResponse.json({
    user: { id: user._id, name: user.name, phone: user.phone, role: user.role }
  });
  res.cookies.set("castle_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
