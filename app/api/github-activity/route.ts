import { NextRequest, NextResponse } from "next/server";
import { fetchContributions, type GitHubActivity } from "../../lib/github-activity";

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;

// Keep the last successful calendar for this server instance during an outage.
const lastGood = new Map<string, GitHubActivity>();

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!USERNAME_PATTERN.test(username) || username.includes("--")) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  const key = username.toLowerCase();
  const fresh = await fetchContributions(key);
  if (fresh) lastGood.set(key, fresh);

  const activity = fresh ?? lastGood.get(key);
  if (!activity) {
    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { contributions: activity.contributions },
    {
      headers: {
        // One short cache, with synchronous refresh on expiry. Never refill
        // this response from a separate, stale upstream fetch cache.
        "Cache-Control": fresh
          ? "public, max-age=0, s-maxage=300, must-revalidate"
          : "public, max-age=0, s-maxage=60, must-revalidate",
        "X-GitHub-Source": activity.source,
        "X-GitHub-Stale": fresh ? "false" : "true",
      },
    },
  );
}
