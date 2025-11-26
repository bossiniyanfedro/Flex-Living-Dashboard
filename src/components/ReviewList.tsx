"use client";

import type { NormalizedReview } from "@/types/reviews";

type ReviewListProps = {
  reviews: NormalizedReview[];
};

export const ReviewList = ({ reviews }: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
        No reviews selected yet. Approve a few from the dashboard to preview them
        here.
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {reviews.map((review) => (
        <article
          key={review.id}
          className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
        >
          <header className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-slate-900">{review.guestName}</p>
              <p className="text-sm text-slate-500">
                Stayed {review.nightsStayed ?? "—"} nights · {review.channel}
              </p>
            </div>
            {typeof review.rating === "number" && (
              <div className="flex flex-col items-end text-right">
                <span className="text-3xl font-semibold text-brand-600">
                  {review.rating.toFixed(1)}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  /5.0
                </span>
              </div>
            )}
          </header>
          <p className="mt-4 text-base text-slate-700">{review.publicReview}</p>
          {review.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
              {review.categories.slice(0, 3).map((category) => (
                <span
                  key={`${review.id}-${category.category}`}
                  className="pill bg-slate-100 text-slate-700"
                >
                  {category.category.replace(/_/g, " ")} ·{" "}
                  {category.rating ? category.rating.toFixed(1) : "n/a"}
                </span>
              ))}
            </div>
          )}
        </article>
      ))}
    </div>
  );
};

