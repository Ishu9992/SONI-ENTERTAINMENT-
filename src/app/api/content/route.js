import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Content from "@/models/Content";

// GET /api/content?q=&genre=&year=&language=&type=&sort=popular&page=1
// Public catalog search/filter/browse endpoint.
export async function GET(request) {
  await connectDB();
  const { searchParams } = new URL(request.url);

  const q = searchParams.get("q");
  const genre = searchParams.get("genre");
  const year = searchParams.get("year");
  const language = searchParams.get("language");
  const type = searchParams.get("type");
  const sort = searchParams.get("sort") || "popular";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(50, parseInt(searchParams.get("limit") || "24", 10));

  const filter = {};
  if (q) filter.$text = { $search: q };
  if (genre) filter.genres = genre;
  if (year) filter.releaseYear = parseInt(year, 10);
  if (language) filter.languages = language;
  if (type) filter.type = type;

  const sortMap = {
    popular: { popularityScore: -1 },
    newest: { releaseYear: -1 },
    rating: { rating: -1 },
    az: { title: 1 }
  };

  const [items, total] = await Promise.all([
    Content.find(filter)
      .sort(sortMap[sort] || sortMap.popular)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("-seasons.episodes.stream -stream"), // keep listing payload light
    Content.countDocuments(filter)
  ]);

  return NextResponse.json({ items, total, page, pages: Math.ceil(total / limit) });
}
