"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const projects = [
  {
    name: "MindMesh",
    logo: "/MindMeshLogo.png",
    url: "https://aimindmesh.netlify.app/",
    description:
      "AI-powered mind mapping platform transforms ideas into visual maps collaboratively.",
  },
  {
    name: "VerbaAI",
    logo: "/verbaAI logo.png",
    url: "https://verbaai.netlify.app/",
    description:
      "VerbaAI is an AI voice-to-email assistant for composing professional emails.",
  },
  {
    name: "Project Physica",
    logo: "/ProjectPhysicaLogo.png",
    url: "https://projectphysica.org/",
    description: "A tool for people of all ages to learn high-level physics simply.",
  },
  {
    name: "MoodMirror",
    logo: "/MoodMirrorLogo.png",
    url: "https://mood-mirror-fawn.vercel.app/",
    description: "A mood tracking app that helps you understand your emotions and improve your mental health.",
  }
];

export default function Projects() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter transition-colors duration-300 px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Three Dots Dropdown */}
        <div className="relative mb-10" ref={menuRef}>
          <button
            aria-label="Open menu"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700 animate-fade-in">
              <Link href="/" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-800 dark:text-gray-200">about</Link>
              <Link href="/work" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-800 dark:text-gray-200">work</Link>
              <Link href="/projects" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-800 dark:text-gray-200">projects</Link>
              <a href="/Shrey Jain Résumé (2).pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 text-gray-800 dark:text-gray-200">resume</a>
            </div>
          )}
        </div>
        <h1 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white tracking-tight">projects</h1>
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
              <div className="flex-shrink-0">
                <Image src={project.logo} alt={project.name + ' Logo'} width={44} height={44} className="rounded-lg object-cover w-11 h-11" />
              </div>
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