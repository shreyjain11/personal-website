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
        <header className="content-haze collection-header lg-rise">
          <p className="page-eyebrow">Research</p>
          <h1 className="page-title">Work</h1>
          <p className="page-lede">
            Research experience spanning computational biology and machine learning.
          </p>
        </header>

        <section className="content-haze" aria-label="Research experience">
          <ol className="entry-list">
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
                className="group entry-link entry-link--work"
              >
                <div className="min-w-0">
                  <h2 className="entry-title">
                    {work.company}
                  </h2>
                  <p className="entry-role">{work.title}</p>
                  {work.description && (
                    <p className="entry-description">
                      {work.description}
                    </p>
                  )}
                </div>
                <span className="entry-date">
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
