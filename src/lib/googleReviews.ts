const GOOGLE_PLACES_ENDPOINT =
  "https://maps.googleapis.com/maps/api/place/details/json";
const GOOGLE_FIELDS = "name,rating,user_ratings_total,reviews";

export type GoogleReview = {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
};

export type GoogleReviewResponse = {
  place_id: string;
  name: string;
  rating?: number;
  user_ratings_total?: number;
  reviews?: GoogleReview[];
};

export type GoogleReviewsWidgetResponse = {
  placeId: string;
  name: string;
  rating: number | null;
  totalReviews: number;
  reviews: Array<{
    author: string;
    rating: number | null;
    relativeTime: string;
    text: string;
    time: number;
  }>;
};

export const buildGooglePlacesUrl = (placeId: string, apiKey: string) =>
  `${GOOGLE_PLACES_ENDPOINT}?place_id=${encodeURIComponent(
    placeId
  )}&fields=${encodeURIComponent(GOOGLE_FIELDS)}&key=${apiKey}`;

export const normalizeGoogleReviews = (
  payload: GoogleReviewResponse
): GoogleReviewsWidgetResponse => ({
  placeId: payload.place_id,
  name: payload.name,
  rating:
    typeof payload.rating === "number"
      ? Number(payload.rating.toFixed(1))
      : null,
  totalReviews: payload.user_ratings_total ?? 0,
  reviews: (payload.reviews ?? []).map((review) => ({
    author: review.author_name,
    rating: typeof review.rating === "number" ? review.rating : null,
    relativeTime: review.relative_time_description,
    text: review.text,
    time: review.time
  }))
});

