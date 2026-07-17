import type { Metadata } from "next";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

export const metadata: Metadata = {
  title: "Work — Shrey Jain",
  description: "Research experience and accolades.",
};

interface WorkExperience {
  company: string;
  url: string;
  title: string;
  date: string;
  description?: string;
}

const workExperiences: WorkExperience[] = [
  {
    company: "Eric and Wendy Schmidt Center",
    url: "https://www.ericandwendyschmidtcenter.org/",
    title: "Researcher",
    date: "Jun 2025 — Present",
    description: "Computational biology research at the Broad Institute.",
  },
];

const accolades: { name: string; url?: string }[] = [
  { name: "Brown University Math Olympiad — Individual Top Scorer", url: "https://www.brumo.org/" },
  { name: "Berkeley Math Tournament — Guts Round Champion", url: "https://berkeley.mt/" },
  { name: "International Biology Bowl — Semifinalist (32 of ~1000)", url: "https://biologybowl.org/" },
  { name: "National Biology Bowl — Top 12", url: "https://www.nationalbiologybowl.org/" },
  { name: "Provisional Patent Holder" },
  { name: "Harvard Undergraduate Research Journal — Finalist", url: "https://www.thurj.com/" },
  { name: "USACO Gold Division", url: "https://usaco.org/" },
  { name: "Discrete Mathematics — Honorable Mention" },
  { name: "Algebra — Honorable Mention" },
];

export default function Work() {
  return (
    <div className="min-h-screen text-foreground font-inter px-5 pt-28 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 lg-rise">
          <AppBreadcrumb />
        </div>

        <header className="mb-10 lg-rise" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none">Work</h1>
        </header>

        {/* Experience */}
        <ol className="border-b border-foreground/10">
          {workExperiences.map((work, i) => (
            <li
              key={work.company}
              className="lg-rise"
              style={{ animationDelay: `${0.12 + i * 0.07}s` }}
            >
              <a
                href={work.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group grid grid-cols-[1fr_auto] items-baseline gap-x-4 border-t border-foreground/10 py-6 sm:gap-x-6 sm:py-7"
              >
                <div className="min-w-0">
                  <h2 className="text-xl tracking-tight text-foreground/90 transition-colors duration-200 group-hover:text-foreground">
                    {work.company}
                  </h2>
                  <p className="mt-1 text-sm text-foreground/60">{work.title}</p>
                  {work.description && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground/50">
                      {work.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 font-mono text-xs tabular-nums text-foreground/40">
                  {work.date}
                </span>
              </a>
            </li>
          ))}
        </ol>

        {/* Accolades */}
        {/* Spacing lives on this wrapper: the global `h1..h6 { margin: 0 }`
            rule overrides margin utilities set directly on the heading. */}
        <div className="mb-5 mt-16 lg-rise" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-2xl tracking-tight">Accolades</h2>
        </div>
        <ul className="border-b border-foreground/10">
          {accolades.map((accolade, i) => {
            const inner = (
              <>
                <span className="text-sm leading-relaxed text-foreground/70 transition-colors duration-200 group-hover:text-foreground">
                  {accolade.name}
                </span>
                {accolade.url && (
                  <svg
                    className="mt-1 shrink-0 text-foreground/20 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/50"
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                )}
              </>
            );
            const rowClass =
              "group flex items-baseline justify-between gap-4 border-t border-foreground/10 py-3.5";
            return (
              <li
                key={accolade.name}
                className="lg-rise"
                style={{ animationDelay: `${0.24 + i * 0.04}s` }}
              >
                {accolade.url ? (
                  <a href={accolade.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                    {inner}
                  </a>
                ) : (
                  <div className={rowClass}>{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
