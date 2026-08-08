import { NextRequest, NextResponse } from "next/server";

type ApiContribution = {
  date: string;
  count: number;
  level: number;
};

const USERNAME_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/i;
const CONTRIBUTIONS_API = "https://github-contributions-api.jogruber.de/v4";

async function fetchContributions(username: string) {
  const response = await fetch(`${CONTRIBUTIONS_API}/${username}?y=last`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Contribution service returned ${response.status}`);
  }

  const payload = (await response.json()) as { contributions?: ApiContribution[] };
  const days = payload.contributions ?? [];
  const firstSunday = days.findIndex(
    (day) => new Date(`${day.date}T00:00:00Z`).getUTCDay() === 0,
  );

  return days.slice(firstSunday < 0 ? 0 : firstSunday).map((day) => ({
    date: day.date,
    count: Math.max(0, day.count),
    level: Math.min(4, Math.max(0, day.level)),
  }));
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim() ?? "";

  if (!USERNAME_PATTERN.test(username) || username.includes("--")) {
    return NextResponse.json({ error: "Invalid GitHub username" }, { status: 400 });
  }

  try {
    const contributions = await fetchContributions(username);

    if (!contributions.length) {
      throw new Error("No contribution data returned");
    }

    return NextResponse.json(
      { contributions },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "GitHub activity is temporarily unavailable" },
      { status: 502 },
    );
  }
}
