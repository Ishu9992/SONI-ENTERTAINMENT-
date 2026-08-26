import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import Hero from "@/components/Hero";
import Carousel from "@/components/Carousel";

export const dynamic = "force-dynamic";

async function getHomeData() {
  await connectDB();
  const [featured, trending, newReleases, series, vip] = await Promise.all([
    Content.find({ featuredOrder: { $ne: null } }).sort({ featuredOrder: 1 }).limit(5).lean(),
    Content.find().sort({ popularityScore: -1 }).limit(16).lean(),
    Content.find().sort({ releaseYear: -1 }).limit(16).lean(),
    Content.find({ type: "series" }).limit(16).lean(),
    Content.find({ accessTier: "premium" }).limit(16).lean(),
  ]);
  return { featured, trending, newReleases, series, vip };
}

export default async function HomePage() {
  const { featured, trending, newReleases, series, vip } = await getHomeData();
  const hero = featured[0];

  return (
    <div>
      <Hero item={hero} />
      <div className="battlement-divider" />
      <div className="pt-6 space-y-2">
        <Carousel title="Trending Now" items={trending} />
        <Carousel title="New Releases" items={newReleases} />
        <Carousel title="Web Series" items={series} />
        <Carousel title="VIP Exclusives ♛" items={vip} />
      </div>

      {trending.length === 0 && (
        <div className="px-6 md:px-14 py-20 text-center text-castle-muted">
          <p className="font-display text-2xl text-castle-gold mb-2">The castle is quiet.</p>
          <p>No titles yet — run the seed script or add content from the Admin Panel to populate the catalog.</p>
        </div>
      )}
    </div>
  );
}
