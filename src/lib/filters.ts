import type { NormalizedReview, ReviewChannel } from "@/types/reviews";

export type TimeframeFilter = "30d" | "90d" | "all";

export type ReviewFilters = {
  channel: ReviewChannel | "All";
  type: "guest-to-host" | "host-to-guest" | "All";
  category: string | "All";
  minRating: number | null;
  timeframe: TimeframeFilter;
  status: "published" | "pending" | "All";
  search: string;
};

export const defaultFilters: ReviewFilters = {
  channel: "All",
  type: "All",
  category: "All",
  minRating: null,
  timeframe: "all",
  status: "All",
  search: ""
};

const withinTimeframe = (review: NormalizedReview, timeframe: TimeframeFilter) => {
  if (timeframe === "all") return true;
  const now = Date.now();
  const cutoff = timeframe === "30d" ? 30 : 90;
  const diff = now - review.submittedEpoch;
  return diff <= cutoff * 24 * 60 * 60 * 1000;
};

export const matchesFilters = (
  review: NormalizedReview,
  filters: ReviewFilters
) => {
  if (filters.channel !== "All" && review.channel !== filters.channel) {
    return false;
  }
  if (filters.type !== "All" && review.type !== filters.type) {
    return false;
  }
  if (filters.status !== "All" && review.status !== filters.status) {
    return false;
  }
  if (
    typeof filters.minRating === "number" &&
    (typeof review.rating !== "number" || review.rating < filters.minRating)
  ) {
    return false;
  }
  if (
    filters.category !== "All" &&
    !review.categories.some((category) => category.category === filters.category)
  ) {
    return false;
  }
  if (!withinTimeframe(review, filters.timeframe)) {
    return false;
  }
  if (
    filters.search &&
    !`${review.publicReview} ${review.privateReview} ${review.guestName} ${review.listingName}`
      .toLowerCase()
      .includes(filters.search.toLowerCase())
  ) {
    return false;
  }
  return true;
};

