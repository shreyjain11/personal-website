"use client";
import Image from "next/image";

interface Project {
  name: string;
  logo?: string;
  url: string;
  description: string;
}

const projects: Project[] = [
  {
    name: "PromptScan",
    url: "https://prompt-injection-scanner.vercel.app",
    description: "Security tool that analyzes GitHub repositories for prompt injection attack potential and hotspots.",
  }
];

export default function Projects() {

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 font-inter transition-colors duration-300 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white tracking-tight">projects</h1>
        <div className="flex flex-col gap-6">
          {projects.map((project, idx) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                (idx === 0 ? " mt-2" : "")
              }
              style={{ minHeight: 64 }}
            >
              {project.logo && (
                <div className="flex-shrink-0">
                  <Image src={project.logo} alt={project.name + ' Logo'} width={44} height={44} className="rounded-lg object-cover w-11 h-11" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors duration-200 leading-tight">{project.name}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{project.description}</span>
              </div>
              <style jsx>{`
                a.group:hover {
                  background-color: #e5e7eb !important; /* bg-gray-200 */
                  box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                }
                @media (prefers-color-scheme: dark) {
                  a.group:hover {
                    background-color: #1f2937 !important; /* bg-gray-800 */
                  }
                }
              `}</style>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 