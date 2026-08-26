/**
 * Seeds Soni Entertainment with an admin account, sample VIP plans and demo titles.
 * Self-contained (does not import the Next.js ESM model files) so it can
 * run as a plain CommonJS Node script.
 *
 * Usage:  node -r dotenv/config scripts/seed.js   (reads .env.local)
 *         or export the vars yourself and run: node scripts/seed.js
 */
require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  { name: String, email: { type: String, unique: true, sparse: true }, phone: { type: String, unique: true, sparse: true }, passwordHash: String, role: { type: String, default: "free" }, premiumUntil: Date },
  { timestamps: true, strict: false }
);
const PlanSchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true }, durationDays: Number, priceInr: Number, perks: [String], badge: String, isActive: { type: Boolean, default: true } },
  { timestamps: true }
);
const ContentSchema = new mongoose.Schema({}, { timestamps: true, strict: false });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Plan = mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
const Content = mongoose.models.Content || mongoose.model("Content", ContentSchema);

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set (check .env.local).");
  await mongoose.connect(uri);

  const adminEmail = (process.env.ADMIN_EMAIL || "ishu@sonimediastudios.com").toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "change_me_immediately";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    await User.create({ name: "Ishu Soni", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 10), role: "admin" });
    console.log(`Created admin: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log(`Admin already exists: ${adminEmail}`);
  }

  const plans = [
    { name: "Weekly VIP", slug: "weekly-vip", durationDays: 7, priceInr: 49, badge: "VIP", perks: ["All VIP titles", "Full HD streaming", "No ads"] },
    { name: "Monthly VIP", slug: "monthly-vip", durationDays: 30, priceInr: 149, badge: "MOST POPULAR", perks: ["All VIP titles", "4K streaming", "No ads", "Watch on 2 devices"] },
    { name: "Yearly VIP", slug: "yearly-vip", durationDays: 365, priceInr: 1299, badge: "BEST VALUE", perks: ["All VIP titles", "4K streaming", "No ads", "Watch on 4 devices", "Early access"] },
  ];
  for (const p of plans) {
    await Plan.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
  }
  console.log(`Upserted ${plans.length} plans.`);

  const demoMovie = {
    title: "Midnight in Rajgarh",
    slug: "midnight-in-rajgarh",
    type: "movie",
    synopsis: "A small-town detective unravels a conspiracy that reaches the palace walls.",
    genres: ["Thriller", "Drama"],
    languages: ["Hindi", "English"],
    releaseYear: 2025,
    ageRating: "U/A 16+",
    posterUrl: "https://picsum.photos/seed/rajgarh-poster/400/600",
    backdropUrl: "https://picsum.photos/seed/rajgarh-backdrop/1600/900",
    accessTier: "premium",
    badges: ["VIP", "NEW"],
    popularityScore: 92,
    rating: 8.1,
    featuredOrder: 1,
    cast: [{ name: "Ananya Rao", role: "Actor" }, { name: "Vikram Sethi", role: "Director" }],
    trivia: ["Shot entirely on location in Rajasthan.", "The score uses a live 40-piece orchestra."],
    stream: {
      hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
      durationSeconds: 6300,
      introStart: 0,
      introEnd: 45,
      subtitles: [{ lang: "en", label: "English", url: "" }],
      audioTracks: [{ lang: "hi", label: "Hindi" }, { lang: "en", label: "English" }],
    },
  };

  const demoSeries = {
    title: "Soni Chronicles",
    slug: "soni-chronicles",
    type: "series",
    synopsis: "Three generations, one media empire, and the secrets that built it.",
    genres: ["Drama"],
    languages: ["Hindi"],
    releaseYear: 2024,
    posterUrl: "https://picsum.photos/seed/chronicles-poster/400/600",
    backdropUrl: "https://picsum.photos/seed/chronicles-backdrop/1600/900",
    accessTier: "free",
    badges: ["NEW"],
    popularityScore: 75,
    rating: 7.6,
    featuredOrder: 2,
    seasons: [
      {
        seasonNumber: 1,
        title: "Season 1",
        episodes: [
          {
            episodeId: "s01e01",
            title: "The Founding",
            episodeNumber: 1,
            synopsis: "Ishu lays the first brick of what becomes Soni Media Studios.",
            stream: { hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", durationSeconds: 1800 },
          },
        ],
      },
    ],
  };

  await Content.updateOne({ slug: demoMovie.slug }, { $set: demoMovie }, { upsert: true });
  await Content.updateOne({ slug: demoSeries.slug }, { $set: demoSeries }, { upsert: true });
  console.log("Seeded 2 demo titles.");

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
