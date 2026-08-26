"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/browse", label: "Browse", icon: "▦" },
  { href: "/live", label: "Live", icon: "◉" },
  { href: "/plans", label: "VIP", icon: "♛" },
  { href: "/settings", label: "You", icon: "☰" },
];

// Hotstar-style quick-action bottom bar for mobile only.
export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-castle-surface/95 backdrop-blur border-t border-white/5 flex justify-around py-2">
      {ITEMS.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 text-[11px] px-3 py-1 ${
              active ? "text-castle-gold" : "text-castle-muted"
            }`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
