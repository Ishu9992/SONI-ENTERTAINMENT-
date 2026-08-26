"use client";

import ContentCard from "./ContentCard";

// Netflix-style horizontal scrolling rail with a titled heading.
export default function Carousel({ title, items }) {
  if (!items?.length) return null;

  return (
    <section className="px-6 md:px-14 py-4">
      <h2 className="text-lg md:text-xl font-semibold mb-3">{title}</h2>
      <div className="castle-rail flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
        {items.map((item) => (
          <ContentCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
