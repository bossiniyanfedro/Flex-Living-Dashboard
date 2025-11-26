import type { ReviewsApiResponse } from "@/types/reviews";

type TrendInsightsProps = {
  summary: ReviewsApiResponse["summary"];
};

export const TrendInsights = ({ summary }: TrendInsightsProps) => {
  const topChannel = Object.entries(summary.channels).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const attentionNeeded = summary.pendingReviews > 0;

  return (
    <div className="glass-card grid gap-6 p-6 md:grid-cols-3">
      <div>
        <p className="text-sm font-semibold text-slate-500">Total Reviews</p>
        <p className="text-4xl font-semibold text-slate-900">
          {summary.totalReviews}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Avg rating {summary.averageRating ?? "—"}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500">Top Channel</p>
        {topChannel ? (
          <p className="text-3xl font-semibold text-slate-900">
            {topChannel[0]}
            <span className="ml-2 text-lg text-slate-500">({topChannel[1]})</span>
          </p>
        ) : (
          <p className="text-3xl font-semibold text-slate-900">—</p>
        )}
        <p className="mt-1 text-sm text-slate-500">
          Channels tracked: {Object.keys(summary.channels).length}
        </p>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-500">Pending Actions</p>
        <p
          className={`text-4xl font-semibold ${
            attentionNeeded ? "text-amber-600" : "text-emerald-600"
          }`}
        >
          {summary.pendingReviews}
        </p>
        <p className="mt-1 text-sm text-slate-500">
          {attentionNeeded
            ? "Follow up with ops & comms"
            : "All caught up — great work"}
        </p>
      </div>
    </div>
  );
};

