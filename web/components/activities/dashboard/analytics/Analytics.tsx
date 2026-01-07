"use client";
import { useMemo } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { normalizeActivity } from "../utils/normalize";

type Activity = {
  Name?: string;
  Distance?: number;
  "Moving Time"?: number;
  "Average Heart Rate"?: number;
  "Average Pace"?: string;
  Date?: string;
  Type?: string;
};

type Props = {
  type: "Run" | "Hike" | "Walk" | "Swim" | "Ride";
  activities: Activity[];
};

const ACTIVITY_COLORS = {
  Run: { primary: "#a855f7", secondary: "#ec4899" },
  Hike: { primary: "#10b981", secondary: "#14b8a6" },
  Walk: { primary: "#3b82f6", secondary: "#06b6d4" },
  Swim: { primary: "#06b6d4", secondary: "#2563eb" },
  Ride: { primary: "#f97316", secondary: "#ef4444" },
};

const RUN_TYPE_COLORS = {
  Easy: "#10b981",
  Tempo: "#f59e0b",
  Threshold: "#ef4444",
  Interval: "#8b5cf6",
  Long: "#3b82f6",
  Recovery: "#06b6d4",
};
const MAX_HR = 195; // ← replace with user-specific value if you have one

const HR_ZONES = [
  { name: "Zone 1", min: 0.5, max: 0.6 },
  { name: "Zone 2", min: 0.6, max: 0.7 },
  { name: "Zone 3", min: 0.7, max: 0.8 },
  { name: "Zone 4", min: 0.8, max: 0.9 },
  { name: "Zone 5", min: 0.9, max: 1.0 },
];
export function Analytics({ type, activities }: Props) {
  const colors = ACTIVITY_COLORS[type];

  const analytics = useMemo(() => {
    const normalized = activities.map((a) => normalizeActivity(a));

    // 1. Training Volume by Week
    const weeklyVolume: { [key: string]: number } = {};
    normalized.forEach((activity) => {
      if (activity.Date && activity.Distance) {
        const date = new Date(activity.Date);
        const weekStart = new Date(date);
        const day = weekStart.getDay() || 7; // Sunday = 7
        weekStart.setDate(weekStart.getDate() - day + 1);
        weekStart.setHours(0, 0, 0, 0);
        const weekKey = weekStart.toISOString().split("T")[0];
        weeklyVolume[weekKey] =
          (weeklyVolume[weekKey] || 0) + activity.Distance;
      }
    });

    const volumeData = Object.entries(weeklyVolume)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([week, distance]) => ({
        week: new Date(week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        distance: Math.round(distance * 10) / 10,
      }));

    // 2. Performance Trend (Pace over time)
    const paceData = normalized
      .filter((a) => a.Date && a["Average Pace"] != null)
      .sort((a, b) => new Date(a.Date!).getTime() - new Date(b.Date!).getTime())
      .slice(-10)
      .map((activity) => {
        const raw = activity["Average Pace"];

        let paceSeconds = 0;
        let paceDisplay = "0:00";

        if (typeof raw === "string") {
          const [min, sec] = raw.split(":").map(Number);
          if (!isNaN(min)) {
            paceSeconds = min * 60 + (sec || 0);
            paceDisplay = raw;
          }
        } else if (typeof raw === "number") {
          paceSeconds = raw;
          const min = Math.floor(raw / 60);
          const sec = Math.round(raw % 60);
          paceDisplay = `${min}:${sec.toString().padStart(2, "0")}`;
        }

        return {
          date: new Date(activity.Date!).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          pace: paceSeconds,
          paceDisplay,
        };
      })
      .filter((d) => d.pace > 0);

    // 3. Run Intensity Buckets (based on HR)
    const runZones: Record<string, number> = {
      Easy: 0,
      Tempo: 0,
      Threshold: 0,
      "Max Effort": 0,
    };

    if (type === "Run") {
      normalized.forEach((activity) => {
        const avgHr = activity["Average Heart Rate"];
        if (!avgHr || avgHr <= 0) return;

        const hrPercent = avgHr / MAX_HR;

        if (hrPercent >= 0.65 && hrPercent < 0.75) {
          runZones.Easy++;
        } else if (hrPercent >= 0.75 && hrPercent < 0.85) {
          runZones.Tempo++;
        } else if (hrPercent >= 0.85 && hrPercent < 0.92) {
          runZones.Threshold++;
        } else if (hrPercent >= 0.92) {
          runZones["Max Effort"]++;
        }
      });
    }

    // Remove empty buckets
    const runTypeData = Object.entries(runZones)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));

    // 4. Distance Distribution
    const distanceDistribution = { short: 0, medium: 0, long: 0 };
    normalized.forEach((activity) => {
      const distance = activity.Distance || 0;
      if (distance < 5) distanceDistribution.short++;
      else if (distance < 10) distanceDistribution.medium++;
      else distanceDistribution.long++;
    });

    const distData = [
      { name: "Short (<5km)", value: distanceDistribution.short },
      { name: "Medium (5-10km)", value: distanceDistribution.medium },
      { name: "Long (>10km)", value: distanceDistribution.long },
    ].filter((d) => d.value > 0);

    // 5. Current Weekly Streak
    const sortedActivities = [...normalized]
      .filter((a) => a.Date)
      .sort(
        (a, b) => new Date(b.Date!).getTime() - new Date(a.Date!).getTime(),
      );

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sortedActivities.length > 0) {
      const weekDays = new Set<number>();
      for (const activity of sortedActivities) {
        const activityDate = new Date(activity.Date!);
        activityDate.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - activityDate.getTime();
        const diffWeeks = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));

        if (diffWeeks === 0) {
          weekDays.add(activityDate.getDay());
        } else if (diffWeeks > 0) {
          break;
        }
      }
      streak = weekDays.size;
    }

    return {
      volumeData,
      paceData,
      runTypeData,
      distData,
      streak,
    };
  }, [activities, type]);

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-400 mb-1">
          No analytics yet
        </h3>
        <p className="text-sm text-zinc-500">Your analytics will appear here</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-2 analytics-scroll">
      <div className="space-y-4">
        {/* Training Volume - Largest */}
        <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Training Volume
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={analytics.volumeData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="week"
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "12px" }}
                label={{
                  value: "Distance (km)",
                  angle: -90,
                  position: "insideLeft",
                  style: { fill: "rgba(255,255,255,0.6)", fontSize: "12px" },
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(0,0,0,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.9)" }}
              />
              <Line
                type="monotone"
                dataKey="distance"
                stroke={colors.primary}
                strokeWidth={3}
                dot={{ fill: colors.secondary, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Grid for smaller charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Performance Trend */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5">
            <h3 className="text-base font-semibold text-white mb-3">
              Performance Trend
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analytics.paceData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: "11px" }}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.4)"
                  style={{ fontSize: "11px" }}
                  tickFormatter={(value) => {
                    const min = Math.floor(value / 60);
                    const sec = value % 60;
                    return `${min}:${sec.toString().padStart(2, "0")}`;
                  }}
                  label={{
                    value: "Pace (min/km)",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "rgba(255,255,255,0.6)", fontSize: "11px" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.9)" }}
                  formatter={(value: any, name, props) => [
                    props.payload.paceDisplay,
                    "Pace",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="pace"
                  stroke={colors.secondary}
                  strokeWidth={2}
                  dot={{ fill: colors.primary, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Streak */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 flex flex-col items-center justify-center">
            <h3 className="text-base font-semibold text-white mb-4">
              Current Weekly Streak
            </h3>
            <div
              className="h-32 w-32 rounded-full border-4 flex items-center justify-center mb-2"
              style={{
                borderColor: colors.primary,
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
              }}
            >
              <div className="text-center">
                <div className="text-4xl font-bold text-white">
                  {analytics.streak}
                </div>
                <div className="text-xs text-zinc-400 mt-1">
                  {analytics.streak === 1 ? "day" : "days"}
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 text-center">
              Active days this week
            </p>
          </div>

          {/* Run Intensity Ring (if type is Run) */}
          {type === "Run" && analytics.runTypeData.length > 0 && (
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 flex flex-col items-center">
              <h3 className="text-base font-semibold text-white mb-4">
                Run Intensity
              </h3>

              <div className="relative h-48 w-48">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={analytics.runTypeData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      startAngle={90}
                      endAngle={-270}
                      stroke="none"
                      animationDuration={800}
                    >
                      {analytics.runTypeData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            entry.name === "Easy"
                              ? "#10b981"
                              : entry.name === "Tempo"
                                ? "#f59e0b"
                                : entry.name === "Threshold"
                                  ? "#ef4444"
                                  : "#dc2626" // Max Effort
                          }
                          className={
                            entry.name === "Max Effort"
                              ? "drop-shadow-[0_0_12px_rgba(239,68,68,0.7)]"
                              : ""
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(0,0,0,0.85)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        fontSize: "11px",
                      }}
                      formatter={(value) => [`${Number(value)} runs`, ""]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-3xl font-bold text-white">
                    {analytics.runTypeData.reduce((s, d) => s + d.value, 0)}
                  </div>
                  <div className="text-xs uppercase tracking-wide text-zinc-400">
                    Runs
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Distance Distribution */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5">
            <h3 className="text-base font-semibold text-white mb-3">
              Distance Distribution
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={analytics.distData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => {
                    const pct = percent ?? 0;
                    return `${name?.split(" ")[0]} ${(pct * 100).toFixed(0)}%`;
                  }}
                  labelLine={false}
                >
                  {analytics.distData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#06b6d4"
                          : index === 1
                            ? "#a855f7"
                            : "#ec4899"
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <style jsx>{`
        .analytics-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .analytics-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .analytics-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(168, 85, 247, 0.4),
            rgba(236, 72, 153, 0.4)
          );
          border-radius: 10px;
        }

        .analytics-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(168, 85, 247, 0.6),
            rgba(236, 72, 153, 0.6)
          );
        }

        .analytics-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.4) transparent;
        }
      `}</style>
    </div>
  );
}
