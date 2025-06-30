"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";

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
    logo: "/MindMeshLogo.png", // TODO: Replace with actual logo if available
    url: "https://projectphysica.org/",
    description: "A tool for people of all ages to learn high-level physics simply.",
  },
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
    <div className="min-h-screen bg-gray-50 text-gray-900 font-inter px-4 py-16 transition-colors duration-300">
      <div className="max-w-2xl mx-auto flex flex-col items-start">
        {/* Dropdown menu */}
        <div className="relative mb-4" ref={menuRef}>
          <button
            aria-label="Open menu"
            className="px-4 py-2 rounded-lg bg-white hover:bg-gray-200 shadow transition focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>
          {open && (
            <div className="absolute left-0 mt-2 w-40 bg-white rounded-xl shadow-lg py-2 z-10 border border-gray-200 animate-fade-in">
              <Link href="/" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-gray-800">home</Link>
              <Link href="/work" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-gray-800">work</Link>
              <Link href="/projects" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-gray-800">projects</Link>
              <a href="/Shrey Jain Résumé (2).pdf" target="_blank" rel="noopener noreferrer" className="block px-4 py-2 rounded-lg text-base font-medium hover:bg-gray-100 transition-all duration-300 hover:scale-105 text-gray-800">resume</a>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold mb-8 text-left">projects</h1>
        <div className="flex flex-col w-full">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-sm hover:scale-105 group"
            >
              <div className="flex-shrink-0 mr-4">
                <Image src={project.logo} alt={project.name + ' Logo'} width={48} height={48} className="rounded-lg object-cover w-12 h-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{project.name}</span>
                <span className="text-sm text-gray-600 mt-0.5">{project.description}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
} 