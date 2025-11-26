import { NextRequest, NextResponse } from "next/server";

import {
  buildGooglePlacesUrl,
  normalizeGoogleReviews,
  type GoogleReviewResponse
} from "@/lib/googleReviews";

const GOOGLE_PLACES_API_KEY =
  process.env.GOOGLE_PLACES_API_KEY ?? process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const placeId = searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "Missing `placeId` query parameter." },
      { status: 400 }
    );
  }

  if (!GOOGLE_PLACES_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Google Places API key not configured. Set GOOGLE_PLACES_API_KEY (recommended) or NEXT_PUBLIC_GOOGLE_PLACES_KEY."
      },
      { status: 501 }
    );
  }

  try {
    const response = await fetch(
      buildGooglePlacesUrl(placeId, GOOGLE_PLACES_API_KEY),
      { cache: "no-store" }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok || !payload) {
      return NextResponse.json(
        {
          error: "Google Places request failed.",
          details: payload?.error_message ?? null
        },
        { status: 502 }
      );
    }

    if (payload.status === "ZERO_RESULTS") {
      return NextResponse.json(
        {
          placeId,
          name: "",
          rating: null,
          totalReviews: 0,
          reviews: []
        },
        { status: 200 }
      );
    }

    const normalized = normalizeGoogleReviews(
      payload.result as GoogleReviewResponse
    );
    return NextResponse.json(normalized);
  } catch (error) {
    console.error("[Google Reviews API] Failed to fetch", error);
    return NextResponse.json(
      { error: "Unable to fetch Google Reviews at the moment." },
      { status: 500 }
    );
  }
}


