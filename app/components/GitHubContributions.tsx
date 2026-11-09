"use client";

import * as React from "react";
import { ActivityHeatmap } from "./ActivityHeatmap";

type ActivityResponse = {
  contributions: { date: string; count: number; level: number }[];
};

type LoadState = "loading" | "ready" | "error";
const REFRESH_INTERVAL_MS = 5 * 60 * 1000;

export function GitHubContributions({
  username,
  hideHeading = false,
}: {
  username: string;
  hideHeading?: boolean;
}) {
  const [status, setStatus] = React.useState<LoadState>("loading");
  const [activity, setActivity] = React.useState<ActivityResponse>({
    contributions: [],
  });

  React.useEffect(() => {
    const controller = new AbortController();
    let inFlight = false;
    let hasLoaded = false;
    setStatus("loading");

    // Retry with backoff before giving up: the upstream source occasionally
    // rate limits, and a second try a moment later usually succeeds.
    const load = async () => {
      if (inFlight || controller.signal.aborted) return;
      inFlight = true;
      try {
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
            hasLoaded = true;
            setActivity(data);
            setStatus("ready");
            return;
          } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") return;
          }
        }
        // Preserve a working calendar if a background refresh briefly fails.
        if (!controller.signal.aborted && !hasLoaded) setStatus("error");
      } finally {
        inFlight = false;
      }
    };

    const refresh = () => {
      if (document.visibilityState === "visible") void load();
    };
    void load();
    const interval = window.setInterval(refresh, REFRESH_INTERVAL_MS);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [username]);

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
        aria-busy={status === "loading"}
      >
        {status === "error" ? (
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
          <ActivityHeatmap data={heatmapData} />
        )}
      </div>
    </div>
  );
}
