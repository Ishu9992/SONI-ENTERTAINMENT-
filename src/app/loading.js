// Next.js renders this automatically while a route segment is loading —
// it doubles as Soni Entertainment's splash screen on cold navigations.
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-castle-bg flex flex-col items-center justify-center gap-4">
      <p className="font-display text-4xl md:text-5xl tracking-[0.2em] text-castle-gold animate-pulse text-center px-6">
        SONI ENTERTAINMENT
      </p>
      <div className="battlement-divider w-64" />
      <p className="text-xs text-castle-muted tracking-wide">
        Crafted with excellence by Ishu Soni - Soni Media Studios
      </p>
    </div>
  );
}
