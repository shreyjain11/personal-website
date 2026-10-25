import { NextRequest, NextResponse } from "next/server";
import { aggregateHourlyEvents, type PublicGitHubEvent } from "../../lib/github-hours";

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() ?? "";
  if (!USERNAME_PATTERN.test(username) || username.includes("--")) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  let timeZone: string;
  try {
    const requestedTimeZone = request.nextUrl.searchParams.get("timeZone") ?? "UTC";
    timeZone = new Intl.DateTimeFormat("en-US", { timeZone: requestedTimeZone }).resolvedOptions().timeZone;
  } catch {
    return NextResponse.json({ error: "Invalid time zone" }, { status: 400 });
  }

  try {
    const events: PublicGitHubEvent[] = [];
    // GitHub exposes up to 300 public events from the last 30 days.
    // No credentials or private-repository data are used.
    for (let page = 1; page <= 3; page += 1) {
      const response = await fetch(
        `https://api.github.com/users/${encodeURIComponent(username)}/events/public?per_page=100&page=${page}`,
        {
          headers: { Accept: "application/vnd.github+json" },
          next: { revalidate: 3600 },
          signal: AbortSignal.timeout(10_000),
        },
      );
      if (!response.ok) throw new Error("GitHub events unavailable");
      const batch = (await response.json()) as PublicGitHubEvent[];
      if (!Array.isArray(batch) || batch.some((event) =>
        !event || typeof event.id !== "string" || typeof event.created_at !== "string" ||
        typeof event.public !== "boolean")) {
        throw new Error("Invalid GitHub events response");
      }
      events.push(...batch);
      if (batch.length < 100) break;
    }

    return NextResponse.json(
      aggregateHourlyEvents(events, timeZone, Date.now(), events.length >= 300),
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Hourly GitHub activity is temporarily unavailable" },
      { status: 502 },
    );
  }
}
