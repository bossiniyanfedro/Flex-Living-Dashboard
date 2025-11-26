"use client";

import { ReviewChannel } from "@/types/reviews";
import type { ReviewFilters } from "@/lib/filters";

const channels: (ReviewChannel | "All")[] = [
  "All",
  "Airbnb",
  "Booking.com",
  "Direct",
  "Vrbo",
  "Unknown"
];

const timeframes = [
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "all", label: "All time" }
];

type FiltersBarProps = {
  filters: ReviewFilters;
  onChange: (filters: ReviewFilters) => void;
  categories: string[];
};

export const FiltersBar = ({ filters, onChange, categories }: FiltersBarProps) => {
  return (
    <div className="glass-card grid gap-4 p-6 md:grid-cols-4">
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Channel
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.channel}
          onChange={(event) =>
            onChange({ ...filters, channel: event.target.value as ReviewChannel | "All" })
          }
        >
          {channels.map((channelOption) => (
            <option key={channelOption} value={channelOption}>
              {channelOption}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Review Type
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as ReviewFilters["type"]
            })
          }
        >
          <option value="All">All</option>
          <option value="guest-to-host">Guest → Host</option>
          <option value="host-to-guest">Host → Guest</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Category
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
        >
          <option value="All">All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Rating Threshold
        <input
          type="number"
          min={1}
          max={5}
          step={0.1}
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.minRating ?? ""}
          placeholder="Any"
          onChange={(event) =>
            onChange({
              ...filters,
              minRating: event.target.value ? Number(event.target.value) : null
            })
          }
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600 md:col-span-2">
        Search guest, keyword, or note
        <input
          type="search"
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="e.g. dishwasher, check-in, crib"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Status
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.status}
          onChange={(event) =>
            onChange({
              ...filters,
              status: event.target.value as ReviewFilters["status"]
            })
          }
        >
          <option value="All">All</option>
          <option value="published">Published</option>
          <option value="pending">Pending</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-slate-600">
        Time Frame
        <select
          className="rounded-2xl border border-slate-200 px-4 py-2 text-base"
          value={filters.timeframe}
          onChange={(event) =>
            onChange({
              ...filters,
              timeframe: event.target.value as ReviewFilters["timeframe"]
            })
          }
        >
          {timeframes.map((frame) => (
            <option key={frame.value} value={frame.value}>
              {frame.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

