"use client";
import { useEffect, useState } from "react";
import { Tabs, Tab } from "@heroui/react";
import { Dashboard } from "@/components/activities/dashboard/Dashboard";
import type { Activity } from "@/components/activities/dashboard/history/History";

const ACTIVITY_TYPES = ["Run", "Hike", "Walk", "Swim", "Ride"] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export function ActivityTabs() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>("Run");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/hoopydoopy/n8n-ezracise/main/web/latest.json",
          { cache: "no-store" },
        );
        const json = await res.json();
        setActivities(json.activities ?? []);
      } catch (error) {
        console.error("Failed to load activities:", error);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const getActivityCount = (type: ActivityType) =>
    activities.filter((a: any) => a.Type === type).length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 text-center px-4">
        <h1 className="mb-3 pt-2 text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
          Ezra&apos;s Activities
        </h1>
      </div>

      {/* Tabs */}
      <div className="pb-2 flex justify-center px-2 sm:px-4">
        <Tabs
          aria-label="Activity Types"
          selectedKey={selectedActivity}
          onSelectionChange={(key) => setSelectedActivity(key as ActivityType)}
          variant="light"
          classNames={{
            base: "max-w-full overflow-x-auto",
            tabList:
              "flex w-max gap-1 sm:gap-3 md:gap-4 bg-black/20 backdrop-blur-sm rounded-2xl p-1.5 sm:p-2 border border-white/5",
            cursor: "rounded-xl shadow-lg",
            tab: "px-4 py-3 sm:px-6 sm:py-4 transition-all duration-300",
            tabContent:
              "group-data-[selected=true]:text-white whitespace-nowrap",
          }}
        >
          {ACTIVITY_TYPES.map((type) => {
            const count = getActivityCount(type);
            return (
              <Tab
                key={type}
                title={
                  <div className="flex flex-col items-center gap-1 min-w-[72px] sm:min-w-[90px]">
                    <span
                      className={`text-sm font-semibold ${
                        selectedActivity === type
                          ? "text-white"
                          : "text-zinc-400"
                      }`}
                    >
                      {type}
                    </span>

                    {!isLoading && (
                      <span
                        className={`text-[11px] sm:text-xs ${
                          selectedActivity === type
                            ? "text-purple-300"
                            : "text-zinc-500"
                        }`}
                      >
                        {count} {count === 1 ? "activity" : "activities"}
                      </span>
                    )}
                  </div>
                }
              />
            );
          })}
        </Tabs>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 pt-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <div className="flex flex-col items-center gap-4">
              <div className="h-10 w-10 sm:h-12 sm:w-12 animate-spin rounded-full border-4 border-purple-500/30 border-t-purple-500" />
              <p className="text-sm sm:text-base text-zinc-400">
                Loading activities...
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {ACTIVITY_TYPES.map((type) => {
              const filtered = activities.filter((a: any) => a.Type === type);
              return (
                <div
                  key={type}
                  className={selectedActivity === type ? "block" : "hidden"}
                >
                  <Dashboard type={type} activities={filtered} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
