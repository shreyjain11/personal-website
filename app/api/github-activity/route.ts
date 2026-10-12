import { NextRequest, NextResponse } from "next/server";

type Contribution = {
  date: string;
  count: number;
  level: number;
};

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;
const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";
const TIMEOUT_MS = 8000;

// Last successful result per user, kept for the life of the server instance.
// Served when every upstream source is failing so the graph never goes blank
// just because a source is briefly down or rate limiting.
const lastGood = new Map<string, Contribution[]>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Primary source. It's a shared free service with a strict per-IP rate limit
// (10 requests / 10s), and Vercel's outbound IPs are shared with many other
// sites, so 429s happen. Retry once after the window has had time to drain.
async function fromContributionsApi(username: string): Promise<Contribution[]> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt > 0) await sleep(1500);

    const response = await fetch(`${CONTRIBUTIONS_API}/${username}?y=last`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.ok) {
      const payload = (await response.json()) as { contributions?: Contribution[] };
      return payload.contributions ?? [];
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Contribution service returned ${response.status}`);
    }
  }

  throw new Error("Contribution service unavailable");
}

// Fallback: read the same data straight from GitHub's contribution calendar,
// which renders one <td data-date data-level> per day plus a <tool-tip>
// ("3 contributions on …" / "No contributions on …") holding the count.
async function fromGitHub(username: string): Promise<Contribution[]> {
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    next: { revalidate: 3600 },
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { Accept: "text/html" },
  });

  if (!response.ok) throw new Error(`GitHub returned ${response.status}`);

  const html = await response.text();
  const counts = new Map<string, number>();
  for (const [, id, text] of html.matchAll(/<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
    counts.set(id, Number.parseInt(text.replace(/,/g, ""), 10) || 0);
  }

  const days: Contribution[] = [];
  for (const [tag] of html.matchAll(/<td\b[^>]*\bdata-date="[^"]+"[^>]*>/g)) {
    const date = tag.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const level = Number(tag.match(/\bdata-level="(\d)"/)?.[1] ?? 0);
    const id = tag.match(/\bid="([^"]+)"/)?.[1];
    if (date) days.push({ date, level, count: id ? counts.get(id) ?? 0 : 0 });
  }

  return days.sort((a, b) => a.date.localeCompare(b.date));
}

function normalize(days: Contribution[]): Contribution[] {
  const firstSunday = days.findIndex(
    (day) => new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0,
  );

  return days.slice(firstSunday < 0 ? 0 : firstSunday).map((day) => ({
    date: day.date,
    count: Math.max(0, day.count),
    level: Math.min(4, Math.max(0, day.level)),
  }));
}

async function fetchContributions(username: string) {
  for (const source of [fromContributionsApi, fromGitHub]) {
    try {
      const contributions = normalize(await source(username));
      if (contributions.length) return contributions;
    } catch {
      // Fall through to the next source.
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!USERNAME_PATTERN.test(username) || username.includes("--")) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  const key = username.toLowerCase();
  const fresh = await fetchContributions(username);
  if (fresh) lastGood.set(key, fresh);

  const contributions = fresh ?? lastGood.get(key);
  if (!contributions) {
    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable" },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    { contributions },
    {
      headers: {
        // Stale data is only a fallback; cache it briefly so a fresh copy is
        // picked up soon after the sources recover.
        "Cache-Control": fresh
          ? "public, s-maxage=3600, stale-while-revalidate=86400"
          : "public, s-maxage=60",
      },
    },
  );
}
