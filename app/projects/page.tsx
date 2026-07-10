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
  tag?: string;
}

const projects: Project[] = [
  {
    name: "Deck",
    url: "https://github.com/shreyjain11/deck",
    description: "Control your Claude Code sessions from your phone — live status cards, a per-session chat view, a real terminal, and push notifications with approve/deny, all served over Tailscale.",
    tag: "tools",
  },
  {
    name: "PromptScan",
    url: "https://prompt-injection-scanner.vercel.app",
    description: "Security tool that analyzes GitHub repositories for prompt injection vulnerabilities and attack hotspots.",
    tag: "security",
  },
  {
    name: "PaperPal",
    url: "https://github.com/shreyjain11/PaperPal",
    description: "RL-powered research paper triage via iMessage using a contextual bandit and local Ollama LLM — zero API costs.",
    tag: "ML",
  },
  {
    name: "Veritas",
    url: "https://veritas-viewer.vercel.app/",
    description: "Model-agnostic auditor that quantifies how much of an ML model's benchmark score comes from data leakage, then recomputes an honest score — without ever running the model.",
    tag: "ML",
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen text-foreground font-inter px-4 pt-28 pb-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <AppBreadcrumb />
        </div>

        <h1 className="text-xl font-semibold mb-8 text-foreground/90 tracking-tight">projects</h1>

        <div className="flex flex-col gap-2">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-4 px-5 py-4 rounded-xl border-l border-transparent hover:border-foreground/20 hover:bg-foreground/[0.03] transition-all duration-200 group"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-foreground leading-tight group-hover:text-foreground/90 transition-colors">
                    {project.name}
                  </span>
                  {project.tag && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-foreground/8 text-foreground/40 uppercase tracking-wider">
                      {project.tag}
                    </span>
                  )}
                </div>
                <span className="text-sm text-foreground/50 leading-snug">{project.description}</span>
              </div>
              <svg
                className="shrink-0 mt-0.5 text-foreground/20 group-hover:text-foreground/50 transition-colors"
                width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10"/>
              </svg>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
