import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Content from "@/models/Content";
import { getAuthUser } from "@/lib/auth";

// GET /api/content/:id — full title detail incl. X-Ray metadata.
// Premium-only streaming URLs are stripped for users without access.
function isObjectId(id) {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

export async function GET(request, { params }) {
  await connectDB();
  const or = [{ slug: params.id }];
  if (isObjectId(params.id)) or.push({ _id: params.id });

  const doc = await Content.findOne({ $or: or }).lean();
  if (!doc) return NextResponse.json({ error: "Title not found." }, { status: 404 });

  const authUser = getAuthUser(request);
  const hasAccess = doc.accessTier === "free" || authUser?.role === "premium" || authUser?.role === "admin";

  if (!hasAccess) {
    delete doc.stream;
    if (doc.seasons) {
      doc.seasons = doc.seasons.map((s) => ({
        ...s,
        episodes: s.episodes.map(({ stream, ...rest }) => rest)
      }));
    }
  }

  return NextResponse.json({ content: doc, locked: !hasAccess });
}
