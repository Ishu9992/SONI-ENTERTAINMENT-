import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/otp";

// POST /api/auth/otp/send  { phone }
export async function POST(request) {
  const { phone } = await request.json();
  if (!phone || !/^\+?[0-9]{10,15}$/.test(phone)) {
    return NextResponse.json({ error: "Enter a valid phone number." }, { status: 400 });
  }
  await sendOtp(phone);
  return NextResponse.json({ ok: true, message: "OTP sent." });
}
