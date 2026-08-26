"use client";

import Link from "next/link";

// Netflix-style cinematic hero: full-bleed backdrop, gradient falloff,
// title logo overlay, and quick actions. `item` is a Content document.
export default function Hero({ item }) {
  if (!item) return null;

  return (
    <section className="relative h-[62vh] md:h-[78vh] w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: `url(${item.backdropUrl})` }}
      />
      <div className="absolute inset-0 bg-castle-fade" />
      <div className="absolute inset-0 bg-gradient-to-r from-castle-bg via-castle-bg/40 to-transparent" />

      <div className="relative z-10 h-full flex flex-col justify-end gap-4 px-6 md:px-14 pb-16 max-w-2xl">
        <div className="flex items-center gap-2">
          {item.badges?.map((b) => (
            <span
              key={b}
              className={`text-[11px] tracking-wide font-mono px-2 py-0.5 rounded ${
                b === "VIP"
                  ? "bg-castle-gold text-castle-bg"
                  : b === "LIVE"
                  ? "bg-castle-live text-white"
                  : "bg-white/10 text-castle-ink"
              }`}
            >
              {b}
            </span>
          ))}
        </div>

        {item.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.logoUrl} alt={item.title} className="max-h-24 w-auto" />
        ) : (
          <h1 className="font-display text-4xl md:text-6xl text-castle-ink drop-shadow-lg">{item.title}</h1>
        )}

        <p className="text-castle-muted text-sm md:text-base line-clamp-3">{item.synopsis}</p>

        <div className="flex items-center gap-3 pt-2">
          <Link
            href={`/watch/${item.slug || item._id}`}
            className="flex items-center gap-2 bg-castle-ink text-castle-bg font-semibold px-6 py-3 rounded hover:bg-white transition-colors"
          >
            ▶ Play
          </Link>
          <Link
            href={`/title/${item.slug || item._id}`}
            className="flex items-center gap-2 bg-white/10 text-castle-ink font-semibold px-6 py-3 rounded hover:bg-white/20 transition-colors backdrop-blur"
          >
            ⓘ More Info
          </Link>
          <button
            aria-label="Add to watchlist"
            className="w-11 h-11 grid place-items-center rounded-full border border-white/30 hover:border-castle-gold hover:text-castle-gold transition-colors"
          >
            +
          </button>
        </div>
      </div>
    </section>
  );
}
