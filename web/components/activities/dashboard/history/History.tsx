"use client";
import { normalizeActivity } from "../utils/normalize";

export type Activity = {
  Name?: string;
  Distance?: number;
  "Moving Time"?: number;
  "Average Heart Rate"?: number;
  "Average Pace"?: string;
  Date?: string;
};

export function History({ activities }: { activities: Activity[] }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center backdrop-blur-sm">
          <svg
            className="w-8 h-8 text-zinc-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-1">
          No activities yet
        </h3>
        <p className="text-sm text-zinc-500">
          Your activities will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto pr-2 space-y-3 history-scroll">
      {activities.map((raw, i) => {
        const activity = normalizeActivity(raw);
        return (
          <div
            key={i}
            className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5"
          >
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/0 to-cyan-500/0 opacity-0 group-hover:from-purple-500/5 group-hover:to-cyan-500/5 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4 gap-3">
                <h3 className="text-lg font-bold text-white transition-all duration-300 flex-1 min-w-0">
                  {activity.Name ?? "Unnamed Activity"}
                </h3>

                {activity.Date && (
                  <span className="flex-shrink-0 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 whitespace-nowrap">
                    {formatDate(activity.Date)}
                  </span>
                )}
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Distance */}
                <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5 border border-white/5 group/metric hover:border-purple-500/20 transition-colors">
                  <div className="flex-shrink-0 text-purple-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-500 mb-0.5">Distance</div>
                    <div className="text-sm font-semibold text-white truncate">
                      {activity.Distance}{" "}
                      <span className="text-xs text-zinc-400 font-normal">
                        km
                      </span>
                    </div>
                  </div>
                </div>

                {/* Moving Time */}
                <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5 border border-white/5 group/metric hover:border-cyan-500/20 transition-colors">
                  <div className="flex-shrink-0 text-cyan-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-500 mb-0.5">Duration</div>
                    <div className="text-sm font-semibold text-white truncate">
                      {activity["Moving Time"]}{" "}
                      <span className="text-xs text-zinc-400 font-normal">
                        min
                      </span>
                    </div>
                  </div>
                </div>

                {/* Average Heart Rate */}
                <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5 border border-white/5 group/metric hover:border-pink-500/20 transition-colors">
                  <div className="flex-shrink-0 text-pink-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-500 mb-0.5">Avg HR</div>
                    <div className="text-sm font-semibold text-white truncate">
                      {activity["Average Heart Rate"]}{" "}
                      <span className="text-xs text-zinc-400 font-normal">
                        bpm
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pace */}
                <div className="flex items-center gap-2.5 rounded-lg bg-white/[0.03] p-2.5 border border-white/5 group/metric hover:border-amber-500/20 transition-colors">
                  <div className="flex-shrink-0 text-amber-400">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-zinc-500 mb-0.5">Pace</div>
                    <div className="text-sm font-semibold text-white truncate">
                      {activity["Average Pace"]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* <style jsx>{` */}
      {/*   .history-scroll::-webkit-scrollbar { */}
      {/*     width: 6px; */}
      {/*   } */}
      {/**/}
      {/*   .history-scroll::-webkit-scrollbar-track { */}
      {/*     background: transparent; */}
      {/*   } */}
      {/**/}
      {/*   .history-scroll::-webkit-scrollbar-thumb { */}
      {/*     background: linear-gradient( */}
      {/*       180deg, */}
      {/*       rgba(168, 85, 247, 0.4), */}
      {/*       rgba(34, 211, 238, 0.4) */}
      {/*     ); */}
      {/*     border-radius: 10px; */}
      {/*   } */}
      {/**/}
      {/*   .history-scroll::-webkit-scrollbar-thumb:hover { */}
      {/*     background: linear-gradient( */}
      {/*       180deg, */}
      {/*       rgba(168, 85, 247, 0.6), */}
      {/*       rgba(34, 211, 238, 0.6) */}
      {/*     ); */}
      {/*   } */}
      {/**/}
      {/*   .history-scroll { */}
      {/*     scrollbar-width: thin; */}
      {/*     scrollbar-color: rgba(168, 85, 247, 0.4) transparent; */}
      {/*   } */}
      {/* `}</style> */}
    </div>
  );
}
