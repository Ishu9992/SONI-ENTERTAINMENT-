import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, sparse: true, trim: true },
    passwordHash: { type: String }, // present for email/password accounts
    role: {
      type: String,
      enum: ["admin", "premium", "free"],
      default: "free"
    },
    premiumUntil: { type: Date, default: null }, // null = not premium / expired
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
    continueWatching: [
      {
        content: { type: mongoose.Schema.Types.ObjectId, ref: "Content" },
        episodeId: { type: String, default: null },
        positionSeconds: { type: Number, default: 0 },
        updatedAt: { type: Date, default: Date.now }
      }
    ],
    avatarUrl: { type: String, default: "" }
  },
  { timestamps: true }
);

UserSchema.methods.isPremiumActive = function () {
  return this.role === "premium" && this.premiumUntil && this.premiumUntil > new Date();
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
