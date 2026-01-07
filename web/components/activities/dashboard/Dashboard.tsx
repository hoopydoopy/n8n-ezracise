"use client";
import { Analytics } from "./analytics/Analytics";
import { History, Activity } from "./history/History";

type Props = {
  type: "Run" | "Hike" | "Walk" | "Swim" | "Ride";
  activities: Activity[];
};

const ACTIVITY_GRADIENTS = {
  Run: "from-purple-500/20 to-pink-500/20",
  Hike: "from-emerald-500/20 to-teal-500/20",
  Walk: "from-blue-500/20 to-cyan-500/20",
  Swim: "from-cyan-500/20 to-blue-600/20",
  Ride: "from-orange-500/20 to-red-500/20",
};

export function Dashboard({ type, activities }: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-[460px_1fr] gap-4 sm:gap-6 lg:h-[70vh] min-h-0">
      {/* LEFT — History */}
      <aside className="relative group min-h-0">
        {/* Glow */}
        <div className="hidden lg:block absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

        {/* Card */}
        <div className="relative flex flex-col lg:h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 shrink-0">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
                  {type} History
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400">
                  {activities.length}{" "}
                  {activities.length === 1 ? "activity" : "activities"} recorded
                </p>
              </div>
            </div>
          </div>

          {/* History content */}
          <div
            className="
          px-4 sm:px-6 pb-4 sm:pb-6
          max-h-[320px] sm:max-h-[420px]
          overflow-y-auto
          lg:max-h-none lg:flex-1
          history-scrollbar
        "
          >
            <History activities={activities} />
          </div>
        </div>
      </aside>

      {/* RIGHT — Analytics */}
      <div className="relative group min-h-0">
        {/* Glow */}
        <div className="hidden lg:block absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-zinc-500/20 to-zinc-400/20 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

        {/* Card */}
        <div className="relative flex flex-col lg:h-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent backdrop-blur-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 shrink-0">
            <h2 className="text-2xl font-bold text-white mb-1">
              {type} Analytics
            </h2>
            <p className="text-sm text-zinc-400">
              Performance insights and trends
            </p>
          </div>

          {/* Analytics content */}
          <div className="px-4 sm:px-6 pb-4 lg:flex-1 lg:overflow-y-auto analytics-scroll">
            <Analytics type={type} activities={activities} />
          </div>
        </div>
      </div>
    </section>
  );
}
