# Soni Entertainment

A premium video streaming platform (Netflix × Amazon Prime × Disney+ Hotstar
UI) built with **Next.js 14 (App Router)** on top of **MongoDB**, deployable
directly to **Vercel**. Produced by **Ishu Soni | Soni Media Studios**.

> Why Next.js instead of a separate React Native app + Express server?
> You said you'll deploy via **GitHub + Vercel** — Vercel runs Next.js
> (frontend + API routes together) natively with zero extra config. A
> separate Express backend would need its own host (Render/Railway/EC2),
> which adds a step with no benefit for a web-first launch. This app is
> fully responsive (phone/tablet/desktop), so it works as your "app" on
> mobile browsers too. If you want a true native iOS/Android app later,
> point a React Native or Flutter client at these same `/api/*` routes —
> the backend/API layer below doesn't change.

## 1. Folder layout

```
castle/
├── src/
│   ├── app/
│   │   ├── page.js                 # Home: hero + carousels
│   │   ├── loading.js               # Splash screen (Crafted by Ishu Soni...)
│   │   ├── layout.js / globals.css  # Root shell, fonts, design tokens
│   │   ├── title/[id]/page.js       # X-Ray style detail page
│   │   ├── watch/[id]/page.js       # Video player page
│   │   ├── plans/page.js            # VIP plan picker
│   │   ├── checkout/[planId]/       # UPI QR + UTR submission
│   │   ├── admin/                   # Admin UTR approval dashboard
│   │   ├── settings/page.js         # Branding / account settings
│   │   └── api/
│   │       ├── auth/{signup,login,otp/send,otp/verify}/route.js
│   │       ├── content/route.js, content/[id]/route.js
│   │       ├── plans/route.js
│   │       ├── transactions/route.js
│   │       └── admin/transactions/route.js, admin/transactions/[id]/route.js
│   ├── components/                  # Navbar, BottomNav, Hero, Carousel,
│   │                                 # ContentCard, VideoPlayer
│   ├── models/                      # User, Content, Plan, Transaction
│   └── lib/                         # db.js, auth.js, otp.js
├── scripts/seed.js                  # Creates admin + demo plans/titles
├── package.json / tailwind.config.js / next.config.mjs / jsconfig.json
└── .env.example
```

## 2. Database schema (MongoDB / Mongoose)

See `DATABASE_SCHEMA.md` for full field-by-field documentation of the
four collections: **users**, **content**, **plans**, **transactions**.

## 3. Local setup

```bash
git clone <your-repo-url> castle && cd castle
npm install
cp .env.example .env.local   # fill in MONGODB_URI, JWT_SECRET, admin creds
npm run seed                 # creates admin user + sample plans/titles
npm run dev                  # http://localhost:3000
```

You'll need a free **MongoDB Atlas** cluster: create one at
mongodb.com/atlas, add a database user, allow access from `0.0.0.0/0`
(or Vercel's IPs), and copy the connection string into `MONGODB_URI`.

## 4. Deploying — GitHub → Vercel, step by step

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Soni Entertainment: initial platform"
   git branch -M main
   git remote add origin https://github.com/<you>/castle.git
   git push -u origin main
   ```
2. **Import into Vercel**: vercel.com → *Add New → Project* → pick the
   `castle` repo → Framework Preset auto-detects **Next.js** → don't
   change build settings.
3. **Add environment variables** (Vercel → Project → Settings →
   Environment Variables) — copy every key from `.env.example`:
   `MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`,
   `NEXT_PUBLIC_UPI_ID`, `NEXT_PUBLIC_UPI_PAYEE_NAME`.
4. **Deploy**. Vercel builds and gives you a `castle-xxxx.vercel.app` URL.
5. **Seed production data** once: run `npm run seed` locally with your
   **production** `MONGODB_URI` in `.env.local` (seeding from CI isn't
   set up — it's a one-time command you run from your machine).
6. Visit `/admin`, sign in as the admin account the seed script created,
   and you'll see the UTR approval queue.

## 5. The UPI payment flow (manual verification, by design)

1. User picks a plan on `/plans`.
2. `/checkout/[planId]` shows your UPI ID (`8076077522@ybl`), payee name,
   amount, and a generated QR code (standard `upi://pay` deep link — opens
   directly in GPay/PhonePe/Paytm when scanned or tapped on mobile).
3. User pays outside the app, then types in the UTR (transaction
   reference number) and optionally a screenshot URL.
4. This creates a `Transaction` with `status: "pending"` — **no money
   movement is verified automatically**, because UPI doesn't expose that
   without a licensed payment aggregator (Razorpay/Cashfree/PhonePe
   Business) integration. This manual-review flow is what you described
   in the brief (steps 1–5), and it's fully wired end to end.
5. You open `/admin`, see every pending UTR with the user's name, plan,
   and amount, and click **Approve**. That instantly sets the user's
   `role` to `premium` and extends `premiumUntil` — unlocking every
   `accessTier: "premium"` stream for them right away.

### Upgrading to automatic verification later
If you want approvals to happen without you clicking anything, the UTR
you collect isn't enough on its own — UPI has no public "did this
transaction happen" lookup. You'd add a payment aggregator (Razorpay UPI
Intent, Cashfree, or PhonePe Business API) which gives you a webhook that
fires the same code currently in
`PATCH /api/admin/transactions/[id]` automatically. The manual flow above
is the correct MVP and is what most solo-run Indian OTT apps launch with.

## 6. Hardening before real users pay you

- **Route-level admin guard**: `/admin` currently relies on the API
  (`requireRole`) to block non-admins from *acting*, but the page itself
  renders for anyone who requests the URL. Add a `middleware.js` that
  verifies the JWT and redirects non-admins before the page loads.
- **Rate-limit** `/api/auth/otp/send` (e.g. with Upstash Redis) so it
  can't be used to spam a phone number.
- **Real SMS provider**: swap `src/lib/otp.js`'s console-log stub for
  Twilio Verify / MSG91 — the function signatures (`sendOtp`,
  `verifyOtp`) are already the integration point.
- **Video storage**: point `hlsUrl` fields at your Cloudflare R2 / AWS S3
  + CDN-fronted HLS output (e.g. via AWS MediaConvert or a self-hosted
  ffmpeg pipeline that packages multiple renditions into one `.m3u8`).
- **Screenshot uploads**: currently the checkout form takes a URL you
  paste in; wire a real upload button to S3/R2 pre-signed URLs when
  you're ready.

## 7. Tech stack

Next.js 14 (App Router, JS) · MongoDB Atlas + Mongoose · JWT auth
(email/password + phone OTP) · hls.js adaptive player · Tailwind CSS ·
`qrcode` for the UPI QR · deploys as a single Vercel project.
