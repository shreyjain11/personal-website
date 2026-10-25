"use client";

import * as React from "react";
import { ActivityHeatmap } from "./ActivityHeatmap";
import type { HourlyActivity } from "../lib/github-hours";

type ActivityResponse = {
  contributions: { date: string; count: number; level: number }[];
};

type LoadState = "loading" | "ready" | "error";

export function GitHubContributions({
  username,
  hideHeading = false,
}: {
  username: string;
  hideHeading?: boolean;
}) {
  const [status, setStatus] = React.useState<LoadState>("loading");
  const [mode, setMode] = React.useState<"calendar" | "hours">("calendar");
  const [hoursStatus, setHoursStatus] = React.useState<LoadState>("loading");
  const [hourly, setHourly] = React.useState<HourlyActivity | null>(null);
  const [hoursAttempt, setHoursAttempt] = React.useState(0);
  const tabId = React.useId();
  const [activity, setActivity] = React.useState<ActivityResponse>({
    contributions: [],
  });

  React.useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    // Retry with backoff before giving up: the upstream source occasionally
    // rate limits, and a second try a moment later usually succeeds.
    const load = async () => {
      for (const delay of [0, 2000, 5000]) {
        if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
        if (controller.signal.aborted) return;
        try {
          const response = await fetch(
            `/api/github-activity?username=${encodeURIComponent(username)}`,
            {
              signal: controller.signal,
              // The API handles caching; don't reuse an older browser-cached calendar.
              cache: "no-store",
            },
          );
          if (!response.ok) continue;
          const data = (await response.json()) as ActivityResponse;
          if (controller.signal.aborted) return;
          if (!data.contributions?.length) continue;
          setActivity(data);
          setStatus("ready");
          return;
        } catch (error: unknown) {
          if (error instanceof DOMException && error.name === "AbortError") return;
        }
      }
      if (!controller.signal.aborted) setStatus("error");
    };

    load();
    return () => controller.abort();
  }, [username]);

  React.useEffect(() => {
    if (mode !== "hours") return;
    const controller = new AbortController();
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const params = new URLSearchParams({ username, timeZone });
    setHoursStatus("loading");
    fetch(`/api/github-hours?${params}`, {
      signal: controller.signal,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load hourly GitHub activity");
        return (await response.json()) as HourlyActivity;
      })
      .then((data) => {
        if (controller.signal.aborted) return;
        setHourly(data);
        setHoursStatus("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setHoursStatus("error");
      });
    return () => controller.abort();
  }, [mode, username, hoursAttempt]);

  const heatmapData = React.useMemo(
    () => activity.contributions.map(({ date, count }) => ({ date, value: count })),
    [activity.contributions],
  );

  return (
    <div className="w-full">
      {!hideHeading ? (
        <h3 className="mb-7 text-2xl font-medium text-foreground">GitHub Contributions</h3>
      ) : null}

      <div
        className="relative w-full overflow-hidden rounded-[28px] border border-foreground/10 bg-background/90 px-4 pb-5 pt-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] sm:px-5 sm:pb-6 sm:pt-6"
      >
        <div role="tablist" aria-label="GitHub activity view" className="mb-5 flex w-fit gap-0.5 rounded-full bg-foreground/5 p-0.5">
          {(["calendar", "hours"] as const).map((view) => (
            <button
              key={view}
              id={`${tabId}-${view}`}
              type="button"
              role="tab"
              aria-selected={mode === view}
              aria-controls={`${tabId}-panel`}
              tabIndex={mode === view ? 0 : -1}
              onClick={() => setMode(view)}
              onKeyDown={(event) => {
                if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
                event.preventDefault();
                const next = event.key === "Home" ? "calendar" : event.key === "End" ? "hours" : view === "calendar" ? "hours" : "calendar";
                setMode(next);
                document.getElementById(`${tabId}-${next}`)?.focus();
              }}
              className={`min-h-10 rounded-full px-4 text-xs font-medium transition-colors ${mode === view ? "bg-background text-foreground shadow-sm" : "text-foreground/55 hover:text-foreground"}`}
            >
              {view === "calendar" ? "Calendar" : "By hour"}
            </button>
          ))}
        </div>
        <div
          id={`${tabId}-panel`}
          role="tabpanel"
          aria-labelledby={`${tabId}-${mode}`}
          aria-busy={(mode === "calendar" ? status : hoursStatus) === "loading"}
        >
        {mode === "hours" ? (
          hoursStatus === "error" ? (
            <div className="min-h-[160px] py-5 text-sm text-foreground/65" role="status">
              <p>Hourly activity couldn’t be loaded. Your calendar is still available.</p>
              <button type="button" className="mt-3 min-h-10 underline underline-offset-4" onClick={() => setHoursAttempt((attempt) => attempt + 1)}>
                Try again
              </button>
            </div>
          ) : hoursStatus === "loading" || !hourly ? (
            <div className="min-h-[160px] text-[13px] text-foreground/75" role="status">
              Loading hourly activity
            </div>
          ) : (
            <>
              <ActivityHeatmap
                key="hours"
                mode="hours"
                matrix={hourly.matrix}
                color="#6d7cff"
                unit="public events"
                summary={hourly.limited
                  ? `${hourly.total.toLocaleString()} recent public events`
                  : `${hourly.total.toLocaleString()} public events in the last ${hourly.windowDays} days`}
              />
              {hourly.limited ? (
                <p className="mt-3 text-[11px] text-foreground/55">Latest 300 public events only</p>
              ) : null}
            </>
          )
        ) : status === "error" ? (
          <div className="flex min-h-[96px] items-center justify-center px-4 text-center">
            <p className="max-w-sm text-sm leading-6 text-foreground/55">
              Activity could not be loaded right now. Visit{" "}
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground/70"
              >
                @{username} on GitHub
              </a>
              .
            </p>
          </div>
        ) : status === "loading" ? (
          <div className="min-h-[160px]" role="status">
            <p className="mb-4 text-[13px] font-medium text-foreground/75">
              Loading GitHub activity
            </p>
            <div className="h-28 rounded-md bg-foreground/5" aria-hidden="true" />
          </div>
        ) : (
          <ActivityHeatmap key="calendar" data={heatmapData} />
        )}
        </div>
      </div>
    </div>
  );
}
