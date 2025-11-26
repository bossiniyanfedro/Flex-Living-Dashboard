"use client";

import type { NormalizedReview } from "@/types/reviews";
import { useReviewSelection } from "./ReviewSelectionContext";

type ReviewsTableProps = {
  listingId: string;
  reviews: NormalizedReview[];
};

export const ReviewsTable = ({ listingId, reviews }: ReviewsTableProps) => {
  const { isApproved, toggleReview } = useReviewSelection();

  if (reviews.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-slate-500">
        No reviews match the current filters for this property.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => {
        const approved = isApproved(listingId, review.id);
        return (
          <article
            key={review.id}
            className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card"
          >
            <header className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="pill capitalize">{review.type.replace(/-/g, " ")}</span>
              <span>{review.channel}</span>
              <span>
                {new Date(review.submittedDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </span>
              <span>Guest: {review.guestName}</span>
              {typeof review.rating === "number" && (
                <span className="rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700">
                  {review.rating.toFixed(1)}
                </span>
              )}
              <button
                className={`ml-auto rounded-full px-4 py-1 text-sm font-semibold ${
                  approved
                    ? "bg-emerald-600 text-white"
                    : "border border-slate-300 text-slate-700"
                }`}
                onClick={() => toggleReview(listingId, review.id)}
              >
                {approved ? "Approved for site" : "Review & approve"}
              </button>
            </header>
            <p className="mt-4 text-base text-slate-800">{review.publicReview}</p>
            {review.privateReview && (
              <p className="mt-3 rounded-2xl bg-slate-50 p-3 text-sm text-slate-500">
                Private note: {review.privateReview}
              </p>
            )}
            {review.categories.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                {review.categories.map((category) => (
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
        );
      })}
    </div>
  );
};

