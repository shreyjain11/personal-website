"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

type ContributionLevel = 0 | 1 | 2 | 3 | 4;

type Contribution = {
  date: string;
  count: number;
  level: ContributionLevel;
};

type ActivityResponse = {
  contributions: Contribution[];
};

type LoadState = "loading" | "ready" | "error";
type HoveredDay = { day: Contribution; x: number; y: number };
type LevelStyle = { backgroundColor: string; opacity: number };

const CELL_SIZE = 11;
const MONTHS = 12;
const WEEKS_PER_MONTH = 365.25 / 12 / 7;
const LEVELS = [0, 1, 2, 3, 4] as const;
const LEVEL_OPACITY: Record<ContributionLevel, number> = {
  0: 0,
  1: 0.3,
  2: 0.52,
  3: 0.76,
  4: 1,
};
const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const CELL_FADE = { duration: 0.2, ease: EASE_OUT } as const;
const TOOLTIP_FADE = { duration: 0.14, ease: EASE_OUT } as const;
const COLUMN_STAGGER = 0.01;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function weeksFor(months: number) {
  return Math.max(1, Math.ceil(months * WEEKS_PER_MONTH));
}

function gapFor(cellSize: number) {
  return Math.max(2, Math.round(cellSize / 4));
}

function describeDay({ count, date }: Contribution) {
  const noun = count === 1 ? "contribution" : "contributions";
  return `${count} ${noun} on ${DATE_FORMAT.format(new Date(`${date}T12:00:00`))}`;
}

function emptyDays(weeks: number): Contribution[] {
  const today = new Date();
  return Array.from({ length: weeks * 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (weeks * 7 - 1 - index));
    return {
      date: date.toISOString().slice(0, 10),
      count: 0,
      level: 0,
    };
  });
}

function toWeeks(contributions: Contribution[]) {
  const weeks: Contribution[][] = [];
  for (let index = 0; index < contributions.length; index += 7) {
    weeks.push(contributions.slice(index, index + 7));
  }
  return weeks;
}

function toMonthLabels(weeks: Contribution[][]) {
  const labels: (string | null)[] = weeks.map(() => null);
  const monthAt = (index: number) => weeks[index]?.[0]?.date.slice(5, 7);

  let start = 0;
  for (let index = 1; index <= weeks.length; index += 1) {
    if (index < weeks.length && monthAt(index) === monthAt(start)) continue;
    if (index - start >= 3) {
      labels[start] = MONTH_NAMES[Number(monthAt(start)) - 1] ?? null;
    }
    start = index;
  }

  return labels;
}

function useFittedColumns(cellSize: number, gap: number) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [columns, setColumns] = React.useState<number>();

  useIsoLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const measure = () => {
      setColumns(
        Math.max(1, Math.floor((element.clientWidth + gap) / (cellSize + gap))),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [cellSize, gap]);

  return [ref, columns] as const;
}

function Tooltip({
  hovered,
  reduceMotion,
}: {
  hovered: HoveredDay;
  reduceMotion: boolean | null;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [left, setLeft] = React.useState(hovered.x);

  useIsoLayoutEffect(() => {
    const half = (ref.current?.offsetWidth ?? 0) / 2;
    const edge = 8 + half;
    setLeft(Math.min(Math.max(hovered.x, edge), window.innerWidth - edge));
  }, [hovered]);

  return createPortal(
    <div
      className="pointer-events-none fixed z-50"
      style={{
        left,
        top: hovered.y,
        transform: "translate(-50%, calc(-100% - 8px))",
      }}
    >
      <motion.div
        ref={ref}
        className="whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background shadow-lg"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
        transition={reduceMotion ? { duration: 0 } : TOOLTIP_FADE}
      >
        {describeDay(hovered.day)}
      </motion.div>
    </div>,
    document.body,
  );
}

function ContributionGrid({
  contributions,
  label,
  loading,
  reduceMotion,
}: {
  contributions: Contribution[];
  label: string;
  loading: boolean;
  reduceMotion: boolean | null;
}) {
  const weeks = React.useMemo(() => toWeeks(contributions), [contributions]);
  const gap = gapFor(CELL_SIZE);
  const [ref, columns] = useFittedColumns(CELL_SIZE, gap);
  const [hovered, setHovered] = React.useState<HoveredDay>();
  const scale = React.useMemo<LevelStyle[]>(
    () =>
      LEVELS.map((level) => ({
        backgroundColor: "#39d353",
        opacity: LEVEL_OPACITY[level],
      })),
    [],
  );

  const cap = Math.min(weeks.length, weeksFor(MONTHS));
  const visible = weeks.slice(-Math.min(cap, columns ?? cap));
  const sweepEnd = (visible.length - 1) * COLUMN_STAGGER + CELL_FADE.duration;

  const hover = (day: Contribution) => (event: React.PointerEvent) => {
    if (loading) return;
    const cell = event.currentTarget.getBoundingClientRect();
    setHovered({ day, x: cell.left + cell.width / 2, y: cell.top });
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className="relative min-h-[113px]"
    >
      <motion.div
        className="flex justify-center"
        style={{ gap, marginBottom: gap }}
        initial={reduceMotion ? false : { opacity: 0, filter: "blur(5px)" }}
        animate={{ opacity: loading ? 0.35 : 1, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.42, delay: loading ? 0 : sweepEnd }}
      >
        {toMonthLabels(visible).map((month, index) => (
          <div
            key={`${month ?? "blank"}-${index}`}
            className="relative h-3 shrink-0"
            style={{ width: CELL_SIZE }}
          >
            {month ? (
              <span className="absolute left-0 top-0 text-[10px] leading-none text-foreground/40">
                {month}
              </span>
            ) : null}
          </div>
        ))}
      </motion.div>

      <div
        className="flex justify-center overflow-hidden"
        style={{ gap }}
        onPointerLeave={() => setHovered(undefined)}
      >
        {visible.map((week, weekIndex) => (
          <div key={week[0]?.date ?? weekIndex} className="flex flex-col" style={{ gap }}>
            {week.map((day) => (
              <motion.div
                key={day.date}
                onPointerEnter={hover(day)}
                className="shrink-0 rounded-[3px] bg-foreground/[0.09]"
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.45 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  ...CELL_FADE,
                  delay: reduceMotion || loading ? 0 : weekIndex * COLUMN_STAGGER,
                }}
              >
                <div
                  className="h-full w-full rounded-[3px]"
                  style={loading ? { opacity: 0 } : scale[day.level]}
                />
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {hovered ? (
          <Tooltip hovered={hovered} reduceMotion={reduceMotion} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function GitHubContributions({
  username,
  hideHeading = false,
}: {
  username: string;
  hideHeading?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = React.useState<LoadState>("loading");
  const [activity, setActivity] = React.useState<ActivityResponse>({
    contributions: [],
  });

  React.useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");

    fetch(`/api/github-activity?username=${encodeURIComponent(username)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load GitHub activity");
        return (await response.json()) as ActivityResponse;
      })
      .then((data) => {
        setActivity(data);
        setStatus("ready");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, [username]);

  const placeholder = React.useMemo(() => emptyDays(weeksFor(MONTHS)), []);
  const contributions = activity.contributions.length
    ? activity.contributions
    : placeholder;
  const total = React.useMemo(
    () => activity.contributions.reduce((sum, day) => sum + day.count, 0),
    [activity.contributions],
  );
  const heading =
    status === "loading"
      ? "Loading GitHub activity"
      : status === "error"
        ? "GitHub activity unavailable"
        : `${total.toLocaleString()} contributions in the past year`;

  return (
    <div className="w-full">
      {!hideHeading ? (
        <h3 className="mb-7 text-2xl font-medium text-foreground">GitHub Contributions</h3>
      ) : null}

      <div
        className="relative w-full overflow-hidden rounded-[28px] border border-foreground/10 bg-background/75 px-4 pb-5 pt-5 shadow-[0_18px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:px-5 sm:pb-6 sm:pt-6"
        aria-busy={status === "loading"}
      >
        <p className="px-1 pb-6 text-sm font-medium leading-none text-foreground/75 sm:pb-7 sm:text-base">
          {heading}
        </p>

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
        ) : (
          <ContributionGrid
            contributions={contributions}
            label={heading}
            loading={status === "loading"}
            reduceMotion={reduceMotion}
          />
        )}

      </div>
    </div>
  );
}
