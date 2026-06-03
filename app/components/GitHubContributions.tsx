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
const LIGHT_THEME = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"] as const;

export function GitHubContributions({ username }: { username: string }) {
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

        const dateObj = new Date(date + 'T12:00:00');
        dateObj.setDate(dateObj.getDate() + 1);
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
        <h3 className="text-2xl font-medium text-foreground mb-8">GitHub Contributions</h3>
        <div className="h-32 flex items-center justify-center">
          <div className="text-foreground/60 text-sm">Loading contributions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="contribution-root">
      <h3 className="text-2xl font-medium text-foreground" style={{ marginBottom: '28px' }}>GitHub Contributions</h3>

      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 bg-foreground/5 border border-foreground/10 text-foreground px-4 py-2 rounded-lg text-sm cursor-pointer hover:bg-foreground/10 transition-all duration-200 focus:outline-none min-w-[120px] justify-between"
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
              <div className="absolute left-0 mt-2 w-[140px] bg-background backdrop-blur-md border border-foreground/10 rounded-lg shadow-xl z-50 overflow-hidden">
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => { setSelectedYear(year); setIsOpen(false); }}
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

      <style jsx global>{`
        .contribution-root {
          width: 100%;
          max-width: 100%;
          overflow: hidden;
        }

        .calendar-wrapper {
          width: 100%;
          overflow: hidden !important;
        }

        .calendar-wrapper > div,
        .calendar-wrapper .react-activity-calendar,
        .calendar-wrapper .react-activity-calendar > div,
        .calendar-wrapper .react-activity-calendar__calendar {
          overflow: hidden !important;
          max-width: 100% !important;
        }

        .calendar-wrapper svg {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .calendar-wrapper .react-activity-calendar__footer,
        .calendar-wrapper .react-activity-calendar__count,
        .calendar-wrapper .react-activity-calendar__legend {
          display: none !important;
        }

        .calendar-wrapper text {
          fill: var(--foreground) !important;
          opacity: 0.5;
        }

        .calendar-wrapper rect {
          rx: 2px;
          ry: 2px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .calendar-wrapper rect:hover {
          stroke: var(--foreground);
          stroke-opacity: 0.5;
          stroke-width: 2px;
        }

        .legend-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          margin-left: 29px;
        }

        .legend-boxes {
          display: flex;
          gap: 3px;
        }

        .legend-boxes span {
          width: 11px;
          height: 11px;
          border-radius: 2px;
          display: block;
        }

        .tooltip-container {
          position: fixed;
          z-index: 9999;
          pointer-events: none;
          transform: translate(-50%, -100%);
        }

        .tooltip-content {
          background: var(--background);
          border: 1px solid color-mix(in srgb, var(--foreground) 20%, transparent);
          color: var(--foreground);
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}
