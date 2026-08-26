"use client";

import Link from "next/link";

// Amazon-style clean grid poster card with Hotstar-style VIP gold ribbon.
export default function ContentCard({ item }) {
  const href = `/title/${item.slug || item._id}`;
  const isVip = item.accessTier === "premium";

  return (
    <Link href={href} className="group relative shrink-0 w-40 md:w-48">
      <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-castle-surface2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.posterUrl}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {isVip && (
          <span className="absolute top-2 left-2 bg-castle-gold text-castle-bg text-[10px] font-bold px-1.5 py-0.5 rounded">
            VIP
          </span>
        )}
        {item.badges?.includes("LIVE") && (
          <span className="absolute top-2 right-2 bg-castle-live text-white text-[10px] font-bold px-1.5 py-0.5 rounded animate-pulse">
            LIVE
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
          <p className="text-xs text-castle-ink line-clamp-2">{item.synopsis}</p>
        </div>
      </div>
      <p className="mt-2 text-sm text-castle-ink truncate">{item.title}</p>
      <p className="text-[11px] text-castle-muted font-mono">
        {item.releaseYear} · {item.genres?.[0]}
      </p>
    </Link>
  );
}
