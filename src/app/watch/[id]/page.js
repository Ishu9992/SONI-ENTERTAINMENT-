import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import VideoPlayer from "@/components/VideoPlayer";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function resolveStream(item, episodeId) {
  if (item.type === "series") {
    for (const season of item.seasons || []) {
      const ep = season.episodes.find((e) => e.episodeId === episodeId);
      if (ep) return { stream: ep.stream, title: `${item.title} — ${ep.title}` };
    }
    const first = item.seasons?.[0]?.episodes?.[0];
    return first ? { stream: first.stream, title: `${item.title} — ${first.title}` } : {};
  }
  return { stream: item.stream, title: item.title };
}

function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export default async function WatchPage({ params, searchParams }) {
  await connectDB();
  const or = [{ slug: params.id }];
  if (isObjectId(params.id)) or.push({ _id: params.id });
  const item = await Content.findOne({ $or: or }).lean();
  if (!item) return notFound();

  // NOTE: this route trusts server-side session checks done in
  // /api/content/:id for locking; a production build should also gate
  // this page itself via middleware before rendering the player.
  const { stream, title } = resolveStream(item, searchParams?.ep);

  if (!stream?.hlsUrl) {
    return (
      <div className="px-6 py-20 text-center">
        <p className="font-display text-2xl text-castle-gold mb-2">This title is VIP-locked.</p>
        <p className="text-castle-muted mb-6">Upgrade to Premium to unlock this stream.</p>
        <Link href="/plans" className="bg-castle-gold text-castle-bg font-semibold px-6 py-3 rounded">
          See VIP Plans
        </Link>
      </div>
    );
  }

  return (
    <div>
      <VideoPlayer stream={stream} title={title} />
      <div className="px-6 md:px-14 py-6">
        <h1 className="text-xl font-semibold">{title}</h1>
        <Link href={`/title/${item.slug || item._id}`} className="text-sm text-castle-gold">
          ← Back to details
        </Link>
      </div>
    </div>
  );
}
