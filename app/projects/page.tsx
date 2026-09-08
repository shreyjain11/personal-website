import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Shrey Jain",
  description: "Software projects and experiments.",
};

interface Project {
  name: string;
  url: string;
  description: string;
}

const projects: Project[] = [
  {
    name: "Veritas",
    url: "https://veritas-viewer.vercel.app/",
    description:
      "Stress-tests AI benchmark scores to understand how reliably they reflect model capabilities.",
  },
  {
    name: "Plexus",
    url: "https://plexus-olive.vercel.app/",
    description:
      "Turns rough, hand-drawn sketches into clean, structured diagrams.",
  },
  {
    name: "Deck",
    url: "https://github.com/shreyjain11/deck",
    description:
      "Manage Claude Code sessions from your phone, with live updates, a terminal, and approval notifications.",
  },
];

export default function Projects() {
  return (
    <main className="page-shell">
      <div>
        <header className="content-haze collection-header lg-rise">
          <p className="page-eyebrow">Selected work</p>
          <h1 className="page-title">Projects</h1>
          <p className="page-lede">
            Tools I’ve built to evaluate AI, clarify ideas, and make development easier.
          </p>
        </header>

        <ul className="content-haze entry-list" aria-label="Selected projects">
          {projects.map((project, i) => (
            <li
              key={project.name}
              className="lg-rise"
              style={{ animationDelay: `${0.12 + i * 0.07}s` }}
            >
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group entry-link"
              >
                <div className="min-w-0">
                  <h2 className="entry-title">
                    {project.name}
                  </h2>
                  <p className="entry-description">
                    {project.description}
                  </p>
                </div>

                <svg
                  aria-hidden="true"
                  className="entry-arrow"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
