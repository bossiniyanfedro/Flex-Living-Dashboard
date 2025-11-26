export type ReviewChannel = "Airbnb" | "Booking.com" | "Direct" | "Vrbo" | "Unknown";

export type ReviewCategory = {
  category: string;
  rating: number | null;
};

export type RawHostawayReview = {
  id: number;
  listingId: string;
  listingName: string;
  type: "guest-to-host" | "host-to-guest";
  status: "published" | "pending" | "archived";
  rating: number | null;
  channel?: string;
  publicReview: string;
  privateReview?: string | null;
  reviewCategory?: ReviewCategory[];
  submittedAt: string;
  guestName: string;
  nightsStayed?: number;
};

export type NormalizedReview = {
  id: number;
  listingId: string;
  listingName: string;
  type: RawHostawayReview["type"];
  status: RawHostawayReview["status"];
  channel: ReviewChannel;
  rating: number | null;
  submittedAt: string;
  submittedDate: string;
  submittedEpoch: number;
  guestName: string;
  nightsStayed: number | null;
  publicReview: string;
  privateReview: string | null;
  categories: ReviewCategory[];
};

export type ListingPerformance = {
  listingId: string;
  listingName: string;
  channelBreakdown: Record<ReviewChannel, number>;
  reviewTypes: Record<RawHostawayReview["type"], number>;
  averageRating: number | null;
  latestReviewDate: string | null;
  totalReviews: number;
  publishedReviews: number;
  pendingReviews: number;
  categoriesAverage: Record<string, number | null>;
  reviews: NormalizedReview[];
};

export type ReviewsApiResponse = {
  source: "hostaway";
  generatedAt: string;
  listings: ListingPerformance[];
  summary: {
    totalReviews: number;
    pendingReviews: number;
    averageRating: number | null;
    reviewTypes: Record<string, number>;
    channels: Record<ReviewChannel, number>;
  };
};

