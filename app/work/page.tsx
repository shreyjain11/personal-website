import type { Metadata } from "next";

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
    date: "Jun 2025 – Present",
    description: "Computational biology research at the Broad Institute.",
  },
];

const accolades = [
  { name: "Brown University Math Olympiad — Individual Top Scorer", url: "https://www.brumo.org/" },
  { name: "Berkeley Math Tournament — Guts Round Champion", url: "https://berkeley.mt/" },
  { name: "International Biology Bowl — Semifinalist (32 of ~1000)", url: "https://biologybowl.org/" },
  { name: "National Biology Bowl — Top 12", url: "https://www.nationalbiologybowl.org/" },
  { name: "Provisional Patent Holder" },
  { name: "Harvard Undergraduate Research Journal — Finalist", url: "https://www.thurj.com/" },
  { name: "USACO Gold Division", url: "https://usaco.org/" },
];

export default function Work() {
  return (
    <div className="min-h-screen text-white font-inter px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <h1 className="text-xl font-semibold mb-8 text-white/90 tracking-tight">work</h1>

        <div className="flex flex-col gap-2">
          {workExperiences.map((work) => (
            <a
              key={work.company}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 px-5 py-4 rounded-xl border-l border-transparent hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200 group"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-tight">{work.company}</span>
                <span className="text-sm text-white/50 mt-0.5">{work.title}</span>
                {work.description && (
                  <span className="text-xs text-white/35 mt-1">{work.description}</span>
                )}
              </div>
              <span className="text-xs text-white/35 shrink-0 mt-0.5 tabular-nums">{work.date}</span>
            </a>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-14 mb-6 text-white/90 tracking-tight">accolades</h2>

        <div className="flex flex-col gap-1">
          {accolades.map((accolade) =>
            accolade.url ? (
              <a
                key={accolade.name}
                href={accolade.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-3 rounded-xl border-l border-transparent hover:border-white/20 hover:bg-white/[0.03] transition-all duration-200 group"
              >
                <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                <span className="text-sm text-white/70 group-hover:text-white/90 transition-colors">{accolade.name}</span>
              </a>
            ) : (
              <div
                key={accolade.name}
                className="flex items-center gap-3 px-5 py-3 rounded-xl"
              >
                <span className="w-1 h-1 rounded-full bg-white/20 shrink-0" />
                <span className="text-sm text-white/70">{accolade.name}</span>
              </div>
            )
          )}
        </div>

      </div>
    </div>
  );
}
