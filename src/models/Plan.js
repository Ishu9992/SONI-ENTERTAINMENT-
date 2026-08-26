import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // "Weekly VIP", "Monthly VIP", "Yearly VIP"
    slug: { type: String, required: true, unique: true },
    durationDays: { type: Number, required: true },
    priceInr: { type: Number, required: true },
    perks: [String],
    badge: { type: String, default: "VIP" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
