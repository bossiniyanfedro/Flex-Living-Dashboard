import type { ReviewsApiResponse } from "@/types/reviews";

type ChannelBreakdownProps = {
  summary: ReviewsApiResponse["summary"];
};

export const ChannelBreakdown = ({ summary }: ChannelBreakdownProps) => {
  const total = Object.values(summary.channels).reduce((acc, count) => acc + count, 0);
  if (total === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">Channel mix</h3>
        <span className="text-sm text-slate-500">{total} total pulls</span>
      </div>
      <div className="mt-4 space-y-3">
        {Object.entries(summary.channels).map(([channel, count]) => {
          const percent = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={channel}>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{channel}</span>
                <span className="font-semibold text-slate-900">{percent}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-brand-500 transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

