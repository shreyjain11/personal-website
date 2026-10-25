export type PublicGitHubEvent = {
  id: string;
  created_at: string;
  public: boolean;
};

export type HourlyActivity = {
  matrix: number[][];
  total: number;
  timeZone: string;
  windowDays: number;
  limited: boolean;
};

const DAY_MS = 86_400_000;
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const WINDOW_DAYS = 30;

export function aggregateHourlyEvents(
  events: PublicGitHubEvent[],
  timeZone: string,
  now = Date.now(),
  limited = false,
): HourlyActivity {
  const hourFormat = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "numeric",
    hourCycle: "h23",
  });
  const matrix = Array.from({ length: 7 }, () => Array<number>(24).fill(0));
  const seen = new Set<string>();
  let total = 0;

  for (const event of events) {
    const timestamp = Date.parse(event.created_at);
    if (!event.public || seen.has(event.id) || !Number.isFinite(timestamp)) continue;
    if (timestamp < now - WINDOW_DAYS * DAY_MS || timestamp > now) continue;
    seen.add(event.id);

    const parts = hourFormat.formatToParts(new Date(timestamp));
    const row = WEEKDAYS.indexOf(parts.find((part) => part.type === "weekday")?.value ?? "");
    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    if (row < 0 || !Number.isInteger(hour) || hour < 0 || hour > 23) continue;
    matrix[row][hour] += 1;
    total += 1;
  }

  return { matrix, total, timeZone, windowDays: WINDOW_DAYS, limited };
}
