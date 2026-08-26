import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

// POST /api/auth/signup  { name, email, password }
export async function POST(request) {
  await connectDB();
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "name, email and password are required." }, { status: 400 });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role: "free" });
  const token = signToken(user);

  const res = NextResponse.json({
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
  res.cookies.set("castle_token", token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30 });
  return res;
}
