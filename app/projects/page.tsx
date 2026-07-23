import type { Metadata } from "next";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";

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
    name: "Plexus",
    url: "https://plexus-olive.vercel.app/",
    description: "Sketch to clean diagram — turns rough hand-drawn sketches into polished, structured diagrams.",
  },
  {
    name: "Deck",
    url: "https://github.com/shreyjain11/deck",
    description:
      "Control your Claude Code sessions from your phone — live status cards, a per-session chat view, a real terminal, and push notifications with approve/deny, all served over Tailscale.",
  },
  {
    name: "PromptScan",
    url: "https://prompt-injection-scanner.vercel.app",
    description:
      "Security tool that analyzes GitHub repositories for prompt injection vulnerabilities and attack hotspots.",
  },
  {
    name: "PaperPal",
    url: "https://github.com/shreyjain11/PaperPal",
    description:
      "RL-powered research paper triage over iMessage using a contextual bandit and a local Ollama LLM — zero API costs.",
  },
  {
    name: "Veritas",
    url: "https://veritas-viewer.vercel.app/",
    description:
      "Model-agnostic auditor that quantifies how much of an ML model's benchmark score comes from data leakage, then recomputes an honest score — without ever running the model.",
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen text-foreground font-inter px-5 pt-28 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="mb-12 lg-rise">
          <AppBreadcrumb />
        </div>

        <header className="mb-10 lg-rise" style={{ animationDelay: "0.05s" }}>
          <h1 className="text-4xl md:text-5xl tracking-tight leading-none">Projects</h1>
        </header>

        <ol className="border-b border-foreground/10">
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
                className="group grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-x-4 border-t border-foreground/10 py-6 sm:gap-x-6 sm:py-7"
              >
                <span className="font-mono text-xs tabular-nums text-foreground/30 transition-colors duration-300 group-hover:text-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <h2 className="text-xl tracking-tight text-foreground/90 transition-colors duration-200 group-hover:text-foreground">
                    {project.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/50">
                    {project.description}
                  </p>
                </div>

                <svg
                  className="mt-1 shrink-0 text-foreground/25 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground/60"
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
        </ol>
      </div>
    </div>
  );
}
