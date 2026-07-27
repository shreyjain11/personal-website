"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const GitHubCalendar = dynamic(
  () => import("react-github-calendar").then((mod) => mod.GitHubCalendar),
  {
    ssr: false,
    loading: () => (
      <div className="h-32 flex items-center justify-center">
        <div className="text-foreground/60 text-sm">Loading contributions...</div>
      </div>
    ),
  }
);

const currentYear = new Date().getFullYear();
const years = [currentYear, currentYear - 1, currentYear - 2];

const DARK_THEME = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"] as const;
// Warm grey empty cell to match cream background; earthy greens for harmony
const LIGHT_THEME = ["#d8d3cb", "#b7ddb0", "#74c476", "#31a354", "#006d2c"] as const;

export function GitHubContributions({
  username,
  hideHeading = false,
}: {
  username: string;
  hideHeading?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isOpen, setIsOpen] = useState(false);
  const [contributionData, setContributionData] = useState<ContributionDay[]>([]);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const [isDark, setIsDark] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const latestDataRef = useRef<ContributionDay[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    setContributionData([]);
  }, [selectedYear]);

  const totalContributions = useMemo(() => {
    return contributionData.reduce((sum, day) => sum + day.count, 0);
  }, [contributionData]);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      if (target.tagName === 'rect' && target.getAttribute('data-date')) {
        const date = target.getAttribute('data-date');

        const dayData = latestDataRef.current.find(d => d.date === date);
        const count = dayData?.count ?? 0;

        // Parse at local noon so the weekday/label can't drift across the
        // UTC boundary. Use the date as-is — no offset.
        const dateObj = new Date(date + 'T12:00:00');
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
        }

        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;

        tooltipTimeoutRef.current = setTimeout(() => {
          setTooltip({
            x: centerX,
            y: rect.top,
            text: `${count} contribution${count !== 1 ? 's' : ''} on ${formattedDate}`
          });
        }, 500);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      if (target.tagName === 'rect' && target.getAttribute('data-date') && tooltip) {
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        setTooltip(prev => prev ? { ...prev, x: centerX, y: rect.top } : null);
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as SVGRectElement;
      if (target.tagName === 'rect') {
        if (tooltipTimeoutRef.current) {
          clearTimeout(tooltipTimeoutRef.current);
          tooltipTimeoutRef.current = null;
        }
        setTooltip(null);
      }
    };

    const container = containerRef.current;
    container.addEventListener('mouseenter', handleMouseEnter, true);
    container.addEventListener('mousemove', handleMouseMove, true);
    container.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
      container.removeEventListener('mouseenter', handleMouseEnter, true);
      container.removeEventListener('mousemove', handleMouseMove, true);
      container.removeEventListener('mouseleave', handleMouseLeave, true);
    };
  }, [mounted, tooltip]);

  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl">
        {!hideHeading ? <h3 className="mb-8 text-2xl font-medium text-foreground">GitHub Contributions</h3> : null}
        <div className="h-32 flex items-center justify-center">
          <div className="text-foreground/60 text-sm">Loading contributions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="contribution-root">
      {!hideHeading ? (
        <h3 className="mb-7 text-2xl font-medium text-foreground">GitHub Contributions</h3>
      ) : null}

      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex min-w-[120px] cursor-pointer items-center justify-between gap-3 rounded-lg border border-foreground/15 bg-foreground/[0.04] px-4 py-2 text-sm text-foreground/80 transition-all duration-200 hover:bg-foreground/[0.07] hover:text-foreground"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label="Select contribution year"
          >
            <span>{selectedYear}</span>
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            >
              <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {isOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsOpen(false)}
              />
              <div className="absolute left-0 z-50 mt-2 w-[140px] overflow-hidden rounded-lg border border-foreground/10 bg-background shadow-xl backdrop-blur-md" role="listbox" aria-label="Contribution year">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setIsOpen(false); }}
                    role="option"
                    aria-selected={selectedYear === year}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedYear === year
                        ? "bg-foreground/10 text-foreground"
                        : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground"
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="text-sm text-foreground/60">
          {totalContributions} contributions in {selectedYear}
        </div>
      </div>

      <div className="calendar-wrapper" ref={containerRef}>
        <GitHubCalendar
          username={username}
          year={selectedYear}
          colorScheme={isDark ? "dark" : "light"}
          blockSize={11}
          blockMargin={3}
          fontSize={11}
          showWeekdayLabels
          showColorLegend={false}
          showTotalCount={false}
          theme={{
            dark: [...DARK_THEME],
            light: [...LIGHT_THEME],
          }}
          transformData={(data: ContributionDay[]) => {
            latestDataRef.current = data;
            if (rafRef.current === null) {
              rafRef.current = requestAnimationFrame(() => {
                rafRef.current = null;
                setContributionData(latestDataRef.current);
              });
            }
            return data;
          }}
        />
      </div>

      <div className="legend-row">
        <span className="text-xs text-foreground/50">Less</span>
        <div className="legend-boxes">
          {theme.map((color, i) => (
            <span key={i} style={{ backgroundColor: color }} />
          ))}
        </div>
        <span className="text-xs text-foreground/50">More</span>
      </div>

      {tooltip && (
        <div
          className="tooltip-container"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y - 10}px`,
          }}
        >
          <div className="tooltip-content">
            {tooltip.text}
          </div>
        </div>
      )}

    </div>
  );
}
