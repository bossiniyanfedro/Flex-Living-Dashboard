import {
  ListingPerformance,
  NormalizedReview,
  RawHostawayReview,
  ReviewChannel,
  ReviewsApiResponse
} from "@/types/reviews";

const channelMap: Record<string, ReviewChannel> = {
  airbnb: "Airbnb",
  "booking.com": "Booking.com",
  booking: "Booking.com",
  direct: "Direct",
  vrbo: "Vrbo"
};

const normalizeChannel = (value?: string): ReviewChannel => {
  if (!value) return "Unknown";
  const key = value.toLowerCase();
  return channelMap[key] ?? "Unknown";
};

const normalizeReview = (review: RawHostawayReview): NormalizedReview => {
  const date = new Date(review.submittedAt);
  const submittedEpoch = Number.isNaN(date.getTime()) ? Date.now() : date.getTime();
  const submittedDate = new Date(submittedEpoch).toISOString();

  return {
    id: review.id,
    listingId: review.listingId,
    listingName: review.listingName,
    type: review.type,
    status: review.status,
    channel: normalizeChannel(review.channel),
    rating: typeof review.rating === "number" ? review.rating : null,
    submittedAt: review.submittedAt,
    submittedDate,
    submittedEpoch,
    guestName: review.guestName,
    nightsStayed: typeof review.nightsStayed === "number" ? review.nightsStayed : null,
    publicReview: review.publicReview,
    privateReview: review.privateReview ?? null,
    categories: review.reviewCategory?.map((category) => ({
      category: category.category,
      rating: typeof category.rating === "number" ? category.rating : null
    })) ?? []
  };
};

const computeCategoryAverage = (reviews: NormalizedReview[]) => {
  const accumulator: Record<string, { total: number; count: number }> = {};

  reviews.forEach((review) => {
    review.categories.forEach((category) => {
      if (typeof category.rating !== "number") return;
      if (!accumulator[category.category]) {
        accumulator[category.category] = { total: 0, count: 0 };
      }
      accumulator[category.category].total += category.rating;
      accumulator[category.category].count += 1;
    });
  });

  return Object.entries(accumulator).reduce<Record<string, number | null>>(
    (acc, [category, stats]) => {
      acc[category] =
        stats.count > 0 ? Number((stats.total / stats.count).toFixed(1)) : null;
      return acc;
    },
    {}
  );
};

const computeListingPerformance = (
  reviews: NormalizedReview[]
): ListingPerformance => {
  const listingId = reviews[0]?.listingId ?? "unknown";
  const listingName = reviews[0]?.listingName ?? "Unknown Listing";

  const channels: Record<ReviewChannel, number> = {
    Airbnb: 0,
    "Booking.com": 0,
    Direct: 0,
    Vrbo: 0,
    Unknown: 0
  };

  const reviewTypes = {
    "guest-to-host": 0,
    "host-to-guest": 0
  } as Record<NormalizedReview["type"], number>;

  const ratings = reviews
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");
  const averageRating =
    ratings.length > 0
      ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2))
      : null;

  reviews.forEach((review) => {
    channels[review.channel] += 1;
    reviewTypes[review.type] += 1;
  });

  const sortedReviews = [...reviews].sort(
    (a, b) => b.submittedEpoch - a.submittedEpoch
  );

  return {
    listingId,
    listingName,
    channelBreakdown: channels,
    reviewTypes,
    averageRating,
    latestReviewDate: sortedReviews[0]?.submittedDate ?? null,
    totalReviews: reviews.length,
    publishedReviews: reviews.filter((review) => review.status === "published").length,
    pendingReviews: reviews.filter((review) => review.status === "pending").length,
    categoriesAverage: computeCategoryAverage(reviews),
    reviews: sortedReviews
  };
};

export const normalizeHostawayReviews = (
  rawReviews: RawHostawayReview[]
): ReviewsApiResponse => {
  const normalized = rawReviews.map(normalizeReview);
  const listingsMap = normalized.reduce<Record<string, NormalizedReview[]>>(
    (acc, review) => {
      if (!acc[review.listingId]) {
        acc[review.listingId] = [];
      }
      acc[review.listingId].push(review);
      return acc;
    },
    {}
  );

  const listings = Object.values(listingsMap).map((reviews) =>
    computeListingPerformance(reviews)
  );

  const ratings = normalized
    .map((review) => review.rating)
    .filter((rating): rating is number => typeof rating === "number");

  const summary = {
    totalReviews: normalized.length,
    pendingReviews: normalized.filter((review) => review.status === "pending").length,
    averageRating:
      ratings.length > 0
        ? Number((ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(2))
        : null,
    reviewTypes: normalized.reduce<Record<string, number>>((acc, review) => {
      acc[review.type] = (acc[review.type] ?? 0) + 1;
      return acc;
    }, {}),
    channels: normalized.reduce<Record<ReviewChannel, number>>((acc, review) => {
      acc[review.channel] = (acc[review.channel] ?? 0) + 1;
      return acc;
    }, {
      Airbnb: 0,
      "Booking.com": 0,
      Direct: 0,
      Vrbo: 0,
      Unknown: 0
    })
  };

  return {
    source: "hostaway",
    generatedAt: new Date().toISOString(),
    listings,
    summary
  };
};

