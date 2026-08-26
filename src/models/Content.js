import mongoose from "mongoose";

const CastMemberSchema = new mongoose.Schema(
  {
    name: String,
    role: String, // e.g. "Actor", "Director", "Writer"
    photoUrl: String
  },
  { _id: false }
);

// One playable stream (a movie file, or a single episode).
const StreamAssetSchema = new mongoose.Schema(
  {
    hlsUrl: { type: String, required: true }, // master .m3u8 with multiple renditions
    dashUrl: { type: String }, // optional .mpd
    durationSeconds: { type: Number, default: 0 },
    introStart: { type: Number, default: null }, // seconds — powers "Skip Intro"
    introEnd: { type: Number, default: null },
    subtitles: [
      { lang: String, label: String, url: String } // WebVTT tracks
    ],
    audioTracks: [{ lang: String, label: String }]
  },
  { _id: false }
);

const EpisodeSchema = new mongoose.Schema({
  episodeId: { type: String, required: true }, // e.g. "s01e01"
  title: String,
  synopsis: String,
  thumbnailUrl: String,
  episodeNumber: Number,
  stream: StreamAssetSchema
});

const SeasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  title: String,
  episodes: [EpisodeSchema]
});

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    type: {
      type: String,
      enum: ["movie", "series", "short", "live"],
      required: true
    },
    synopsis: String,
    genres: [{ type: String, index: true }],
    languages: [String],
    releaseYear: { type: Number, index: true },
    ageRating: { type: String, default: "U/A 13+" },
    posterUrl: String, // vertical grid poster
    backdropUrl: String, // wide hero image
    trailerHlsUrl: String,
    logoUrl: String, // transparent title-treatment logo for hero overlay

    cast: [CastMemberSchema],
    trivia: [String], // X-Ray style trivia bullets

    accessTier: { type: String, enum: ["free", "premium"], default: "free" },

    // movie / short
    stream: StreamAssetSchema,

    // series
    seasons: [SeasonSchema],

    // live TV / sports
    isLiveChannel: { type: Boolean, default: false },
    liveStreamUrl: String,
    liveSchedule: [{ title: String, startsAt: Date, endsAt: Date }],

    popularityScore: { type: Number, default: 0, index: true },
    rating: { type: Number, min: 0, max: 10, default: 0 },

    badges: [String], // e.g. "NEW", "VIP", "4K", "LIVE"
    featuredOrder: { type: Number, default: null } // powers the hero carousel
  },
  { timestamps: true }
);

ContentSchema.index({ title: "text", synopsis: "text", genres: "text" });

export default mongoose.models.Content || mongoose.model("Content", ContentSchema);
