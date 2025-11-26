import { NextResponse } from "next/server";

import mockPayload from "@/data/mockHostawayReviews.json";
import { normalizeHostawayReviews } from "@/lib/reviewNormalizer";
import type { RawHostawayReview, ReviewsApiResponse } from "@/types/reviews";

const HOSTAWAY_ACCOUNT_ID = process.env.HOSTAWAY_ACCOUNT_ID || "61148";
const HOSTAWAY_API_KEY =
  process.env.HOSTAWAY_API_KEY ||
  "f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152";
const HOSTAWAY_API_URL =
  process.env.HOSTAWAY_API_URL ||
  `https://api.hostaway.com/v1/accounts/${HOSTAWAY_ACCOUNT_ID}/reviews`;

const fetchHostawayPayload = async (): Promise<RawHostawayReview[]> => {
  try {
    const response = await fetch(HOSTAWAY_API_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Hostaway-API-Key": HOSTAWAY_API_KEY
      },
        // Hostaway sandbox is known to be empty. We gracefully fallback to mock.
      next: { revalidate: 60 }
    });

    if (!response.ok) {
      throw new Error(`Hostaway responded with ${response.status}`);
    }

    const payload = await response.json();
    if (Array.isArray(payload?.result) && payload.result.length > 0) {
      return payload.result as RawHostawayReview[];
    }
    return (mockPayload.result as RawHostawayReview[]) ?? [];
  } catch (error) {
    console.warn(
      "[Hostaway API] Falling back to mock payload. Reason:",
      (error as Error).message
    );
    return (mockPayload.result as RawHostawayReview[]) ?? [];
  }
};

export async function GET() {
  try {
    const rawReviews = await fetchHostawayPayload();
    const normalized: ReviewsApiResponse = normalizeHostawayReviews(rawReviews);
    return NextResponse.json(normalized, { status: 200 });
  } catch (error) {
    console.error("[Hostaway API] Failed to serve reviews", error);
    return NextResponse.json(
      {
        error: "Unable to process reviews at the moment."
      },
      { status: 500 }
    );
  }
}

