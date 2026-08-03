import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work — Shrey Jain",
  description: "Research experience in computational biology and machine learning.",
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
    company: "Sabeti Lab",
    url: "https://www.sabetilab.org/",
    title: "Researcher",
    date: "Jan 2026 — Present",
    description: "Machine learning research at the Broad Institute.",
  },
  {
    company: "Zitnik Lab",
    url: "https://zitniklab.hms.harvard.edu/",
    title: "Researcher",
    date: "Jun 2025 — Aug 2025",
    description: "AI for medicine and science research at Harvard Medical School.",
  },
];

export default function Work() {
  return (
    <main className="page-shell">
      <div>
        <header className="content-haze mb-16 lg-rise">
          <p className="page-eyebrow">Research</p>
          <h1 className="page-title">Work</h1>
          <p className="page-lede">
            Research experience spanning computational biology and machine learning.
          </p>
        </header>

        <section className="content-haze" aria-labelledby="experience-title">
          <h2 id="experience-title" className="section-heading mb-5">Experience</h2>
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
                className="group grid grid-cols-1 gap-3 border-t border-foreground/10 py-7 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-x-7 sm:py-8"
              >
                <div className="min-w-0">
                  <h3 className="text-[1.35rem] font-medium tracking-[-0.025em] text-foreground/90 transition-colors duration-200 group-hover:text-foreground">
                    {work.company}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/60">{work.title}</p>
                  {work.description && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground/50">
                      {work.description}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-xs tabular-nums text-foreground/40">
                  {work.date}
                </span>
              </a>
            </li>
          ))}
          </ol>
        </section>

      </div>
    </main>
  );
}
