"use client";

import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/browse?type=movie", label: "Movies" },
  { href: "/browse?type=series", label: "Series" },
  { href: "/live", label: "Live TV" },
  { href: "/plans", label: "VIP Plans" },
];

export default function Navbar() {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 hidden md:flex items-center justify-between gap-6 px-10 py-4 bg-gradient-to-b from-castle-bg/95 to-castle-bg/0 backdrop-blur">
      <div className="flex items-center gap-10">
        <Link href="/" className="font-display text-xl tracking-widest text-castle-gold leading-tight">
          SONI
          <span className="block text-[10px] tracking-[0.3em] text-castle-muted font-body">ENTERTAINMENT</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-castle-muted">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-castle-ink transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <form action="/search" className="relative">
          <input
            name="q"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, genres, cast..."
            className="w-64 rounded-full bg-castle-surface2 border border-white/5 px-4 py-2 text-sm placeholder:text-castle-muted focus:outline-none focus:ring-2 focus:ring-castle-gold"
          />
        </form>
        <Link
          href="/plans"
          className="rounded-full bg-castle-gold text-castle-bg text-sm font-semibold px-4 py-2 hover:bg-castle-goldSoft transition-colors"
        >
          Go VIP
        </Link>
        <Link href="/settings" className="w-9 h-9 rounded-full bg-castle-amethyst grid place-items-center text-sm font-semibold">
          U
        </Link>
      </div>
    </header>
  );
}
