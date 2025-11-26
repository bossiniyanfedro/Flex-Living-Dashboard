'use client';

import { useEffect, useMemo, useState } from "react";

import { FiltersBar } from "@/components/FiltersBar";
import { ListingPerformanceCard } from "@/components/ListingPerformanceCard";
import { ReviewSelectionProvider } from "@/components/ReviewSelectionContext";
import { ReviewsTable } from "@/components/ReviewsTable";
import { TrendInsights } from "@/components/TrendInsights";
import { ChannelBreakdown } from "@/components/ChannelBreakdown";
import { defaultFilters, matchesFilters, type ReviewFilters } from "@/lib/filters";
import type { ListingPerformance, ReviewsApiResponse } from "@/types/reviews";

const DashboardContent = () => {
  const [data, setData] = useState<ReviewsApiResponse | null>(null);
  const [filters, setFilters] = useState<ReviewFilters>(defaultFilters);
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews/hostaway");
        if (!response.ok) {
          throw new Error("Failed to load reviews");
        }
        const payload = (await response.json()) as ReviewsApiResponse;
        setData(payload);
        setSelectedListingId(payload.listings[0]?.listingId ?? null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const categories = useMemo(() => {
    if (!data) return [];
    const categorySet = new Set<string>();
    data.listings.forEach((listing) => {
      Object.keys(listing.categoriesAverage).forEach((category) =>
        categorySet.add(category)
      );
    });
    return Array.from(categorySet);
  }, [data]);

  const filteredListings = useMemo(() => {
    if (!data) return [];
    return data.listings
      .map((listing) => ({
        ...listing,
        reviews: listing.reviews.filter((review) => matchesFilters(review, filters))
      }))
      .filter((listing) => listing.reviews.length > 0);
  }, [data, filters]);

  const filteredReviewCount = useMemo(
    () => filteredListings.reduce((sum, listing) => sum + listing.reviews.length, 0),
    [filteredListings]
  );

  const selectedListing: ListingPerformance & { reviews: ListingPerformance["reviews"] } | null =
    filteredListings.find((listing) => listing.listingId === selectedListingId) ??
    filteredListings[0] ??
    null;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center text-slate-500">
        Loading Hostaway reviews...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center text-red-500">
        {error ?? "Unable to load reviews"}
      </div>
    );
  }

  return (
    <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10">
      <header className="flex flex-col gap-3">
        <span className="pill bg-brand-100 text-brand-700">Manager cockpit</span>
        <h1 className="text-4xl font-semibold text-slate-900">Reviews Dashboard</h1>
        <p className="text-slate-600">
          Filter, triage, and approve guest stories before they sync to flexliving.com.
        </p>
      </header>
      <TrendInsights summary={data.summary} />
      <ChannelBreakdown summary={data.summary} />
      <FiltersBar filters={filters} onChange={setFilters} categories={categories} />
      <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-5 py-3 text-sm text-slate-600">
        {filteredListings.length > 0 ? (
          <p>
            Showing{" "}
            <span className="font-semibold text-slate-900">{filteredListings.length}</span>{" "}
            {filteredListings.length === 1 ? "property" : "properties"} with{" "}
            <span className="font-semibold text-slate-900">{filteredReviewCount}</span>{" "}
            matching reviews.
          </p>
        ) : (
          <p>
            No reviews match the current filters. Try widening the timeframe or resetting the
            category.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="space-y-6">
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <button
                key={listing.listingId}
                type="button"
                onClick={() => setSelectedListingId(listing.listingId)}
                className="w-full text-left focus-visible:outline-none"
              >
                <ListingPerformanceCard
                  listing={listing}
                  isActive={selectedListingId === listing.listingId}
                />
              </button>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
              Adjust the filters to surface at least one property.
            </div>
          )}
        </div>
        <div className="glass-card sticky top-24 h-fit p-6">
          <h2 className="text-2xl font-semibold text-slate-900">
            Review queue
          </h2>
          <p className="text-sm text-slate-500">
            Approve which quotes will appear publicly.
          </p>
          <div className="mt-4 max-h-[70vh] overflow-y-auto pr-2">
            {selectedListing ? (
              <ReviewsTable
                listingId={selectedListing.listingId}
                reviews={selectedListing.reviews}
              />
            ) : (
              <p className="text-sm text-slate-500">
                {filteredListings.length === 0
                  ? "No reviews match the current filters."
                  : "Select a property to review its feedback."}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default function DashboardPage() {
  return (
    <ReviewSelectionProvider>
      <DashboardContent />
    </ReviewSelectionProvider>
  );
}

