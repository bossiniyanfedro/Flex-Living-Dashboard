'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { ReviewSelectionProvider, useReviewSelection } from "@/components/ReviewSelectionContext";
import { ReviewList } from "@/components/ReviewList";
import { getListingProfile } from "@/data/listings";
import type { ReviewsApiResponse } from "@/types/reviews";
import type { GoogleReviewsWidgetResponse } from "@/lib/googleReviews";

type PropertyPageProps = {
  params: { listingId: string };
};

const PropertyView = ({ listingId }: { listingId: string }) => {
  const profile = getListingProfile(listingId);
  const [data, setData] = useState<ReviewsApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleState, setGoogleState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    data: GoogleReviewsWidgetResponse | null;
    message?: string;
  }>({
    status: profile?.googlePlaceId ? "loading" : "idle",
    data: null
  });
  const { approvedMap } = useReviewSelection();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetch("/api/reviews/hostaway");
        if (!response.ok) throw new Error("Failed to fetch property reviews");
        const payload = (await response.json()) as ReviewsApiResponse;
        setData(payload);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const listing = data?.listings.find((entry) => entry.listingId === listingId) ?? null;

  useEffect(() => {
    if (!profile?.googlePlaceId) {
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    setGoogleState({ status: "loading", data: null });

    const fetchGoogleReviews = async () => {
      try {
        const response = await fetch(
          `/api/reviews/google?placeId=${profile.googlePlaceId}`,
          { signal: controller.signal }
        );
        const payload = (await response.json().catch(() => null)) as
          | GoogleReviewsWidgetResponse
          | { error?: string }
          | null;
        if (!response.ok || !payload || "error" in payload) {
          throw new Error(
            (payload as { error?: string })?.error ??
              "Google Places request failed. Confirm API key configuration."
          );
        }
        if (!cancelled) {
          setGoogleState({
            status: "success",
            data: payload as GoogleReviewsWidgetResponse
          });
        }
      } catch (err) {
        if (cancelled || controller.signal.aborted) return;
        setGoogleState({
          status: "error",
          data: null,
          message: (err as Error).message
        });
      }
    };

    fetchGoogleReviews();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [profile?.googlePlaceId]);

  const approvedReviews = useMemo(() => {
    if (!listing) return [];
    const approvedIds = approvedMap[listingId] ?? [];
    return listing.reviews.filter((review) => approvedIds.includes(review.id));
  }, [approvedMap, listing, listingId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-slate-500">
        Loading property data...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-red-500">
        {error ?? "Unknown property"}
      </div>
    );
  }

  return (
    <section className="flex flex-col">
      <div
        className="relative min-h-[360px] w-full overflow-hidden bg-slate-900 text-white"
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(17,24,39,0.8), rgba(15,23,42,0.4)), url(${profile.heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-16">
          <Link href="/dashboard" className="pill w-fit bg-white/20 text-white">
            Back to dashboard
          </Link>
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">Flex Living</p>
          <h1 className="text-5xl font-semibold">{profile.name}</h1>
          <p className="text-lg text-white/80">{profile.address}</p>
          <div className="flex flex-wrap gap-3 text-sm text-white/80">
            {profile.amenities.map((amenity) => (
              <span key={amenity} className="pill bg-white/10 text-white">
                {amenity}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-2xl font-semibold text-slate-900">
              {profile.description}
            </h2>
            <ul className="mt-4 space-y-2 text-slate-600">
              {profile.highlights.map((line) => (
                <li key={line}>• {line}</li>
              ))}
            </ul>
          </article>
          <article className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Guest sentiment
                </p>
                <h2 className="text-3xl font-semibold text-slate-900">
                  {listing?.averageRating ?? "—"} / 5.0
                </h2>
              </div>
              <div className="text-right text-sm text-slate-500">
                <p>{listing?.totalReviews ?? 0} total reviews</p>
                <p>{approvedReviews.length} approved for public view</p>
              </div>
            </div>
            <ReviewList reviews={approvedReviews} />
          </article>
        </div>
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
              Operations health
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Pending reviews</span>
                <span className="font-semibold text-amber-600">
                  {listing?.pendingReviews ?? 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Channel mix leader</span>
                <span className="font-semibold text-slate-900">
                  {listing
                    ? Object.entries(listing.channelBreakdown).sort((a, b) => b[1] - a[1])[0]?.[0]
                    : "—"}
                </span>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">Google Reviews pilot</p>
            {profile?.googlePlaceId ? (
              <>
                {googleState.status === "loading" && (
                  <p className="mt-3 text-slate-500">Pulling Google feedback…</p>
                )}
                {googleState.status === "error" && (
                  <p className="mt-3 text-amber-600">
                    {googleState.message ??
                      "Add NEXT_PUBLIC_GOOGLE_PLACES_KEY to enable live Google data."}
                  </p>
                )}
                {googleState.status === "success" && googleState.data && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm text-slate-600">
                      <span>Average rating</span>
                      <span className="text-lg font-semibold text-slate-900">
                        {googleState.data.rating ?? "—"}
                      </span>
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                      {googleState.data.totalReviews} public Google reviews
                    </p>
                    <div className="space-y-3">
                      {googleState.data.reviews.slice(0, 2).map((review) => (
                        <blockquote
                          key={`${review.author}-${review.time}`}
                          className="rounded-2xl border border-white bg-white/70 p-3 text-sm text-slate-600"
                        >
                          <p className="font-semibold text-slate-900">
                            {review.author} · {review.rating ?? "—"}★
                          </p>
                          <p className="text-xs text-slate-400">
                            {review.relativeTime}
                          </p>
                          <p className="mt-2">{review.text}</p>
                        </blockquote>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="mt-2">No Google Places ID yet. Request one from marketing.</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default function PropertyPage({ params }: PropertyPageProps) {
  return (
    <ReviewSelectionProvider>
      <PropertyView listingId={params.listingId} />
    </ReviewSelectionProvider>
  );
}

