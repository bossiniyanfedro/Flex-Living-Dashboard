# Flex Living Reviews Control Tower

Internal dashboard + property review surface for the Flex Living developer assessment.

## Quick Start

```bash
npm install
npm run dev
```

Visit:
- `http://localhost:3000` – landing overview
- `/dashboard` – manager cockpit
- `/property/n1-loft` – property layout sample

## Highlights
- **Mocked Hostaway integration** that still honors the provided account id/key and gracefully falls back to `src/data/mockHostawayReviews.json`.
- **Normalization pipeline** (`src/lib/reviewNormalizer.ts`) groups reviews per listing, calculates averages, and ships a consistent API response for the UI.
- **Manager dashboard** with filters for rating/channel/type/category/timeframe/status + keyword search, approval toggles, and insights (trend cards + channel mix).
- **Property page** mirrors flexliving.com layout and only displays approved testimonials thanks to the shared `ReviewSelectionProvider`.
- **Google Reviews exploration** now includes a `/api/reviews/google` proxy; once a Places API key + `place_id` are configured, real Google feedback appears in the property sidebar.

## Deployment
1. `vercel link` (or `vercel init`)
2. Add env vars (`HOSTAWAY_ACCOUNT_ID`, `HOSTAWAY_API_KEY`, optional `NEXT_PUBLIC_GOOGLE_PLACES_KEY`)
3. `vercel --prod`

Any platform that runs `npm run build && npm run start` also works.

## Documentation
See `docs/IMPLEMENTATION.md` for deeper notes on tech stack, API behavior, Google Places findings, and the AI tools (ChatGPT – GPT-5.1 Codex) used during implementation.

