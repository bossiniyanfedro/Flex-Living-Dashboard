## Flex Living • Reviews Dashboard

### 1. Tech Stack
- **Framework:** Next.js 14 (App Router, React Server/Client Components mix)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + light custom tokens
- **Data utilities:** `date-fns` for date handling, lightweight normalization helpers
- **State:** Local component state + contextual review approval store (localStorage)
- **AI assistance:** ChatGPT (OpenAI GPT-5.1 Codex) was used to accelerate ideation and code generation.

### 2. Getting Started
```bash
npm install
npm run dev
# visit http://localhost:3000
```

Environment variables (optional but ready):
```
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=...provided...
HOSTAWAY_API_URL=https://api.hostaway.com/v1/accounts/61148/reviews
NEXT_PUBLIC_GOOGLE_PLACES_KEY=your-google-places-api-key
```
If the Hostaway sandbox responds with no data, the API automatically falls back to `src/data/mockHostawayReviews.json`.

### 3. Key Design Decisions
1. **Normalized API contract** – `/api/reviews/hostaway` always returns a structured payload with per-listing aggregates (`listings[]`) plus global `summary`. The frontend never needs to know Hostaway quirks.
2. **Approval workflow** – Managers toggle approval per review. The approved IDs live in `localStorage` (via `ReviewSelectionProvider`) so the dashboard and property page stay in sync without a separate DB.
3. **Filter-centric dashboard** – Filters are first-class: rating threshold, category, channel, type, timeframe, keyword search, and status. The derived listing cards & review queue respond instantly to the filter state.
4. **Property layout parity** – `/property/[listingId]` mirrors Flex Living’s marketing layout (hero, highlights, amenities) and only renders approved reviews, making it a trustworthy preview for publishing.
5. **Google Reviews exploration** – `src/lib/googleReviews.ts` documents how to call the Places API and provides helper utilities. The UI includes a toggleable card reminding managers to plug in the Places key/ID once ready.

### 4. API Behavior
- **Route:** `GET /api/reviews/hostaway`
- **Headers:** Attempts to use provided Hostaway credentials; caches results for 60s when live data is available.
- **Response:** `{ source, generatedAt, listings: ListingPerformance[], summary }`
  - Each `ListingPerformance` contains aggregated stats plus the normalized `reviews[]`.
  - Categories/scores are averaged server-side so the UI can highlight the weakest areas fast.
- **Fallback:** Any network/auth error logs a warning and returns the bundled mock payload to keep the UI running.
- **Bonus:** `GET /api/reviews/google?placeId=` proxies the Google Places Details endpoint (when `GOOGLE_PLACES_API_KEY` or `NEXT_PUBLIC_GOOGLE_PLACES_KEY` is configured) and returns a trimmed summary suited for the property sidebar.

### 5. Dashboard Features
- Instant search & filtering
- Insight cards (total reviews, top channel, pending counts, channel mix)
- Listing cards with weakest-category callouts
- Sticky review queue with approve toggles
- Local persistence of approval decisions

### 6. Property Display
- Marketing-style hero with highlights & amenities (data in `src/data/listings.ts`)
- Sentiment summary (avg rating, approved count)
- Approved reviews presented in masonry grid
- Operational sidebar (pending counts, channel mix leader, Google Reviews reminder)

### 7. Google Reviews Findings
- Google Places API provides up to 5 most helpful reviews via `place/details`.
- Requires Places API enabled + billing + `NEXT_PUBLIC_GOOGLE_PLACES_KEY`.
- Each Flex Living property should store its `place_id` (sample for Shoreditch included).
- A serverless proxy (`/api/reviews/google`) is ready. Once the API key is supplied, the property page automatically surfaces the most recent Google snippets alongside Hostaway content.

### 8. Deployment Notes
1. `vercel login`
2. `vercel init` (or `vercel link`)
3. Set env vars in the dashboard (`HOSTAWAY_*`, `NEXT_PUBLIC_GOOGLE_PLACES_KEY`)
4. `vercel --prod`



