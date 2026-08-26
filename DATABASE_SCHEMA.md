# Soni Entertainment — Database Schema (MongoDB / Mongoose)

Four collections. Full field definitions live in `src/models/*.js`; this
is the reference summary.

## `users`
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | unique, sparse (email/password accounts) |
| phone | String | unique, sparse (OTP accounts) |
| passwordHash | String | bcrypt, only for email accounts |
| role | enum: `admin` \| `premium` \| `free` | drives access control |
| premiumUntil | Date \| null | expiry of current VIP pass; `isPremiumActive()` checks this |
| watchlist | [ObjectId → content] | "quick-add" watchlist |
| continueWatching | [{ content, episodeId, positionSeconds, updatedAt }] | resume playback |
| avatarUrl | String | |

## `content`
Covers movies, series, short films, and live channels in one collection
(`type` discriminates), so search/browse/carousels query a single index.

| Field | Type | Notes |
|---|---|---|
| title, slug | String | slug is the public URL id |
| type | enum: `movie` \| `series` \| `short` \| `live` | |
| synopsis, genres[], languages[], releaseYear, ageRating | | filterable fields |
| posterUrl, backdropUrl, logoUrl, trailerHlsUrl | String | artwork |
| cast[] | `{ name, role, photoUrl }` | X-Ray cast/crew panel |
| trivia[] | String | X-Ray trivia bullets |
| accessTier | enum: `free` \| `premium` | gates streaming URLs |
| stream | `{ hlsUrl, dashUrl, durationSeconds, introStart, introEnd, subtitles[], audioTracks[] }` | movies/shorts |
| seasons[] | `{ seasonNumber, episodes: [{ episodeId, title, stream, ... }] }` | series |
| isLiveChannel, liveStreamUrl, liveSchedule[] | | Live TV/Sports tab |
| popularityScore, rating | Number | ranking / sort |
| badges[] | String | `NEW`, `VIP`, `4K`, `LIVE` |
| featuredOrder | Number \| null | powers the home-page hero carousel |

Text index on `title + synopsis + genres` powers `/api/content?q=`.
`GET /api/content/:id` strips `stream`/episode `stream` fields server-side
when the requester doesn't have premium access — the client never
receives a locked title's playback URL.

## `plans`
| Field | Type | Notes |
|---|---|---|
| name, slug | String | "Weekly VIP" / "Monthly VIP" / "Yearly VIP" |
| durationDays | Number | added to `premiumUntil` on approval |
| priceInr | Number | shown at checkout |
| perks[] | String | plan card bullet points |
| badge | String | e.g. "MOST POPULAR" |
| isActive | Boolean | soft-disable a plan without deleting it |

## `transactions`
The manual UPI verification ledger.

| Field | Type | Notes |
|---|---|---|
| user, plan | ObjectId refs | |
| amountInr | Number | copied from the plan at submit time |
| upiId | String | the payee UPI id shown at checkout |
| utr | String, indexed | the reference number the user typed in |
| screenshotUrl | String \| null | optional proof |
| status | enum: `pending` \| `approved` \| `rejected` | default `pending` |
| reviewedBy | ObjectId → users | admin who actioned it |
| reviewedAt | Date | |
| adminNote | String | |

`PATCH /api/admin/transactions/:id { action: "approve" }` is the only
place `user.role`/`user.premiumUntil` get upgraded — there is no other
code path that grants premium access, which is the correct place to look
if you ever need to audit how someone became VIP.
