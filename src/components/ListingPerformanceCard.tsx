import clsx from "clsx";

import type { ListingPerformance } from "@/types/reviews";

type ListingPerformanceCardProps = {
  listing: ListingPerformance;
  isActive?: boolean;
};

const formatPercent = (value: number, total: number) => {
  if (total === 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

export const ListingPerformanceCard = ({
  listing,
  isActive = false
}: ListingPerformanceCardProps) => {
  const worstCategory = Object.entries(listing.categoriesAverage)
    .filter(([, rating]) => typeof rating === "number")
    .sort((a, b) => (a[1] ?? 0) - (b[1] ?? 0))[0];

  return (
    <article
      className={clsx(
        "glass-card flex flex-col gap-4 rounded-[32px] border p-6 transition duration-200",
        isActive
          ? "border-brand-500 bg-gradient-to-br from-white via-brand-50/40 to-white shadow-[0_20px_45px_rgba(79,89,245,0.2)]"
          : "border-slate-100 hover:border-brand-200"
      )}
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
            {listing.listingId}
          </p>
          <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
            {listing.totalReviews} reviews
          </span>
        </div>
        <h3 className="text-2xl font-semibold text-slate-900">{listing.listingName}</h3>
        <p className="text-sm text-slate-500">
          Latest review on{" "}
          {listing.latestReviewDate
            ? new Date(listing.latestReviewDate).toLocaleDateString()
            : "—"}
        </p>
      </header>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
          <p className="text-sm text-slate-500">Average rating</p>
          <p className="text-3xl font-semibold text-slate-900">
            {listing.averageRating ?? "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
          <p className="text-sm text-slate-500">Approval status</p>
          <p className="text-3xl font-semibold text-green-600">
            {listing.publishedReviews}/{listing.totalReviews}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-4 text-center">
          <p className="text-sm text-slate-500">Pending attention</p>
          <p className="text-3xl font-semibold text-amber-500">
            {listing.pendingReviews}
          </p>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Channels</p>
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            {Object.entries(listing.channelBreakdown).map(([channel, count]) => (
              <div key={channel} className="flex items-center justify-between">
                <span>{channel}</span>
                <span className="font-semibold text-slate-900">
                  {count} ({formatPercent(count, listing.totalReviews)})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-700">Categories focus</p>
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            {Object.entries(listing.categoriesAverage).map(([category, score]) => (
              <div key={category} className="flex items-center justify-between">
                <span>{category.replace(/_/g, " ")}</span>
                <span className="font-semibold text-slate-900">
                  {score ? score.toFixed(1) : "—"}
                </span>
              </div>
            ))}
          </div>
          {worstCategory && (
            <p className="mt-3 rounded-xl bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-800">
              Needs attention: {worstCategory[0].replace(/_/g, " ")} at{" "}
              {worstCategory[1]?.toFixed(1)}
            </p>
          )}
        </div>
      </section>
    </article>
  );
};

