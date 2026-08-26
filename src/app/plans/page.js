import { connectDB } from "@/lib/db";
import Plan from "@/models/Plan";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  await connectDB();
  const plans = await Plan.find({ isActive: true }).sort({ priceInr: 1 }).lean();

  return (
    <div className="px-6 md:px-14 py-12 max-w-5xl mx-auto">
      <h1 className="font-display text-3xl text-castle-gold mb-2">Soni Entertainment VIP Passes</h1>
      <p className="text-castle-muted mb-10">Unlock every VIP title, 4K streaming, and zero interruptions.</p>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan._id} className="rounded-xl border border-castle-gold/30 bg-castle-surface p-6 flex flex-col">
            <span className="self-start bg-castle-gold text-castle-bg text-[11px] font-bold px-2 py-1 rounded mb-4">
              {plan.badge}
            </span>
            <h2 className="text-xl font-semibold mb-1">{plan.name}</h2>
            <p className="text-3xl font-display text-castle-gold mb-4">
              ₹{plan.priceInr}
              <span className="text-sm text-castle-muted font-body"> / {plan.durationDays} days</span>
            </p>
            <ul className="text-sm text-castle-muted space-y-2 mb-6 flex-1">
              {plan.perks.map((p) => (
                <li key={p}>✓ {p}</li>
              ))}
            </ul>
            <Link
              href={`/checkout/${plan._id}`}
              className="text-center bg-castle-gold text-castle-bg font-semibold py-3 rounded hover:bg-castle-goldSoft transition-colors"
            >
              Choose {plan.name}
            </Link>
          </div>
        ))}
      </div>

      {plans.length === 0 && (
        <p className="text-castle-muted">No plans configured yet — add them via the seed script or Admin Panel.</p>
      )}
    </div>
  );
}
