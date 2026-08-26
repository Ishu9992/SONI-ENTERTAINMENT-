import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyPassword, signToken } from "@/lib/auth";

// POST /api/auth/login  { email, password }
export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  const user = await User.findOne({ email: (email || "").toLowerCase() });
  if (!user || !user.passwordHash) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = signToken(user);
  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
  res.cookies.set("castle_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
