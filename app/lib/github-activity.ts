type Contribution = {
  date: string;
  count: number;
  level: number;
};

const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";
const TIMEOUT_MS = 8000;

export type GitHubActivity = {
  contributions: Contribution[];
  source: "github" | "github-api" | "contributions-api";
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

// Optional fallback when the public calendar is unavailable.
async function fromGitHubApi(username: string): Promise<Contribution[]> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return [];

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `query ($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks { contributionDays { date contributionCount contributionLevel } }
            }
          }
        }
      }`,
      variables: { login: username },
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });

  if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);

  const payload = (await response.json()) as {
    data?: {
      user?: {
        contributionsCollection: {
          contributionCalendar: {
            weeks: {
              contributionDays: { date: string; contributionCount: number; contributionLevel: string }[];
            }[];
          };
        };
      } | null;
    };
  };

  const weeks = payload.data?.user?.contributionsCollection.contributionCalendar.weeks ?? [];
  return weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVELS[day.contributionLevel] ?? 0,
    })),
  );
}

// Fallback source. It's a shared free service with a strict per-IP rate limit
// (10 requests / 10s), and Vercel's outbound IPs are shared with many other
// sites, so 429s happen. Retry once after the window has had time to drain.
async function fromContributionsApi(username: string): Promise<Contribution[]> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt > 0) await sleep(1500);

    const response = await fetch(`${CONTRIBUTIONS_API}/${username}?y=last`, {
      cache: "no-store",
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

// Read the data straight from the user's public GitHub contribution calendar,
// which renders one <td data-date data-level> per day plus a <tool-tip>
// ("3 contributions on …" / "No contributions on …") holding the count.
async function fromGitHub(username: string): Promise<Contribution[]> {
  const response = await fetch(`https://github.com/users/${username}/contributions`, {
    cache: "no-store",
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
    if (date) {
      // A changed/incomplete response must trigger fallback, not zero counts.
      if (!id || !counts.has(id)) throw new Error("Incomplete GitHub calendar");
      days.push({ date, level, count: counts.get(id)! });
    }
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

export async function fetchContributions(username: string): Promise<GitHubActivity | null> {
  // Match the public profile, including anonymized private contributions the
  // owner has chosen to show. A third-party copy is a last resort.
  // All fetches bypass Next's cache: only the final API response is cached.
  const sources = [
    ["github", fromGitHub],
    ["github-api", fromGitHubApi],
    ["contributions-api", fromContributionsApi],
  ] as const;
  for (const [source, fetchSource] of sources) {
    try {
      const contributions = normalize(await fetchSource(username));
      if (contributions.length) return { contributions, source };
    } catch {
      // Fall through to the next source.
    }
  }

  return null;
}
