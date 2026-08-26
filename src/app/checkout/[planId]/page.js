import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import CheckoutForm from "./CheckoutForm";

export const dynamic = "force-dynamic";

const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "8076077522@ybl";
const PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_PAYEE_NAME || "Ishu Soni | Soni Media Studios";

// Server component: builds the standard UPI deep-link and renders it as a
// scannable QR (works with GPay / PhonePe / Paytm / any UPI app).
export default async function CheckoutPage({ params }) {
  await connectDB();
  const plan = await Plan.findById(params.planId).lean();
  if (!plan) return notFound();

  const upiUri = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(
    PAYEE_NAME
  )}&am=${plan.priceInr}&cu=INR&tn=${encodeURIComponent("Soni Entertainment " + plan.name)}`;

  const qrDataUrl = await QRCode.toDataURL(upiUri, { margin: 1, width: 320, color: { dark: "#0B0B10", light: "#F5F3EE" } });

  return (
    <div className="px-6 md:px-14 py-12 max-w-3xl mx-auto">
      <h1 className="font-display text-3xl text-castle-gold mb-2">Complete your payment</h1>
      <p className="text-castle-muted mb-10">
        {plan.name} · ₹{plan.priceInr} · {plan.durationDays} days
      </p>

      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="bg-castle-surface rounded-xl p-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="UPI QR code" className="mx-auto rounded-lg mb-4" />
          <p className="font-mono text-castle-gold text-lg">{UPI_ID}</p>
          <p className="text-sm text-castle-muted">{PAYEE_NAME}</p>
          <p className="text-2xl font-display mt-3">₹{plan.priceInr}</p>
          <p className="text-xs text-castle-muted mt-4">
            Scan with any UPI app (GPay, PhonePe, Paytm) or pay manually to the ID above.
          </p>
        </div>

        <CheckoutForm planId={plan._id.toString()} planName={plan.name} upiId={UPI_ID} />
      </div>
    </div>
  );
}
