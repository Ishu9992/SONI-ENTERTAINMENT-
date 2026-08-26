import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

async function getTitle(id) {
  await connectDB();
  const or = [{ slug: id }];
  if (isObjectId(id)) or.push({ _id: id });
  return Content.findOne({ $or: or }).lean();
}

// Amazon-style "X-Ray" detail page: cast/crew, trivia, seasons/episodes,
// multi-audio & subtitle indicators, and the VIP lock state.
export default async function TitlePage({ params }) {
  const item = await getTitle(params.id);
  if (!item) return notFound();

  const isSeries = item.type === "series";

  return (
    <div className="px-6 md:px-14 py-8 max-w-5xl mx-auto">
      <div className="relative rounded-xl overflow-hidden mb-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.backdropUrl} alt={item.title} className="w-full h-64 md:h-96 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-castle-bg to-transparent" />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-2">
        <h1 className="font-display text-3xl md:text-4xl">{item.title}</h1>
        {item.accessTier === "premium" && (
          <span className="bg-castle-gold text-castle-bg text-xs font-bold px-2 py-1 rounded">VIP ONLY</span>
        )}
      </div>
      <p className="text-castle-muted text-sm mb-4 font-mono">
        {item.releaseYear} · {item.ageRating} · {item.genres?.join(", ")} · ★ {item.rating}
      </p>
      <p className="mb-6 max-w-2xl">{item.synopsis}</p>

      <Link
        href={`/watch/${item.slug || item._id}`}
        className="inline-block bg-castle-gold text-castle-bg font-semibold px-6 py-3 rounded mb-10 hover:bg-castle-goldSoft transition-colors"
      >
        ▶ {item.accessTier === "premium" ? "Play (VIP)" : "Play"}
      </Link>

      {isSeries && item.seasons?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Episodes</h2>
          {item.seasons.map((season) => (
            <div key={season.seasonNumber} className="mb-6">
              <h3 className="text-sm font-mono text-castle-gold mb-2">Season {season.seasonNumber}</h3>
              <div className="space-y-2">
                {season.episodes.map((ep) => (
                  <Link
                    key={ep.episodeId}
                    href={`/watch/${item.slug || item._id}?ep=${ep.episodeId}`}
                    className="flex items-center gap-3 bg-castle-surface rounded-lg p-3 hover:bg-castle-surface2 transition-colors"
                  >
                    <span className="font-mono text-castle-muted w-6">{ep.episodeNumber}</span>
                    <div>
                      <p className="font-medium">{ep.title}</p>
                      <p className="text-xs text-castle-muted line-clamp-1">{ep.synopsis}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {item.cast?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Cast & Crew</h2>
          <div className="flex flex-wrap gap-4">
            {item.cast.map((c) => (
              <div key={c.name} className="w-24 text-center">
                <div className="w-24 h-24 rounded-full bg-castle-surface2 overflow-hidden mb-2">
                  {c.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={c.photoUrl} alt={c.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <p className="text-xs font-medium">{c.name}</p>
                <p className="text-[11px] text-castle-muted">{c.role}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {item.trivia?.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">X-Ray Trivia</h2>
          <ul className="list-disc list-inside space-y-1 text-sm text-castle-muted">
            {item.trivia.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {item.stream?.audioTracks?.length > 0 && (
        <section className="mb-10 text-sm text-castle-muted">
          <p>Audio: {item.stream.audioTracks.map((a) => a.label).join(" · ")}</p>
          <p>Subtitles: {item.stream.subtitles?.map((s) => s.label).join(" · ") || "None"}</p>
        </section>
      )}
    </div>
  );
}
