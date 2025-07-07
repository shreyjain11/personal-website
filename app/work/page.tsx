"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const workExperiences = [
  {
    company: "The Broad Institute of MIT and Harvard",
    logo: "/Broad.jpeg",
    url: "https://www.broadinstitute.org/",
    title: "Evolutionary Genomic Researcher",
    description: "Developed deterministic, gradient-free explainability pipeline for evolutionary phylogenetic inference, computing per-residue attributions reproducibly."  },
  {
    company: "Project Physica",
    logo: "/ProjectPhysicaLogo.png",
    url: "https://projectphysica.org/",
    title: "Founder and Lead Developer",
    description: "Built a platform for students to learn physics through interactive simulations."
  },
];

const accolades = [
  { logo: "/verbaAI logo.png", name: "Valedictorian (1 out of ~500)", url: "https://schools.friscoisd.org/campus/high-school/centennial/home" },
  { logo: "/MindMeshLogo.png", name: "International Research Olympiad Semifinalist (Top 10% of 4500)", url: "https://www.internationalresearcholympiad.org/" },
  { logo: "/verbaAI logo.png", name: "International Biology Bowl Semifinalist (32 of ~1000)", url: "https://biologybowl.org/" },
  { logo: "/MindMeshLogo.png", name: "Top 12 National Biology Bowl", url: "https://www.nationalbiologybowl.org/" },
  { logo: "/verbaAI logo.png", name: "Provisional Patent Holder" },
  { logo: "/MindMeshLogo.png", name: "The Harvard Undergraduate Research Journal Finalist", url: "https://www.thurj.org/" },
  { logo: "/verbaAI logo.png", name: "USACO Silver Division" },
];

export default function Work() {
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
        <h1 className="text-2xl font-semibold mb-8 text-gray-900 dark:text-white tracking-tight">work</h1>
        <div className="flex flex-col gap-6">
          {workExperiences.map((work, idx) => (
            <a
              key={work.company}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className={
                `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                (idx === 0 ? " mt-2" : "")
              }
              style={{ minHeight: 64 }}
            >
              <div className="flex flex-col">
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{work.company}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{work.title}</span>
                <span className="text-sm text-gray-600 dark:text-gray-300 mt-0.5 leading-snug">{work.description}</span>
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
        {/* Accolades Section */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-900 dark:text-white tracking-tight">accolades</h2>
        <div className="flex flex-col gap-4">
          {accolades.map((accolade, idx) =>
            accolade.url ? (
              <a
                key={accolade.name}
                href={accolade.url}
                target="_blank"
                rel="noopener noreferrer"
                className={
                  `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                  (idx === 0 ? " mt-2" : "")
                }
                style={{ minHeight: 56 }}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{accolade.name}</span>
                <style jsx>{`
                  a.group:hover {
                    background-color: #e5e7eb !important;
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                  }
                  @media (prefers-color-scheme: dark) {
                    a.group:hover {
                      background-color: #1f2937 !important;
                    }
                  }
                `}</style>
              </a>
            ) : (
              <div
                key={accolade.name}
                className={
                  `flex items-center gap-4 px-5 py-4 rounded-2xl bg-gray-50 dark:bg-gray-900 transition-all duration-200 group` +
                  (idx === 0 ? " mt-2" : "")
                }
                style={{ minHeight: 56 }}
              >
                <span className="text-base font-medium text-gray-900 dark:text-white transition-colors duration-200 leading-tight">{accolade.name}</span>
                <style jsx>{`
                  div.group:hover {
                    background-color: #e5e7eb !important;
                    box-shadow: 0 4px 16px 0 rgba(0,0,0,0.06);
                  }
                  @media (prefers-color-scheme: dark) {
                    div.group:hover {
                      background-color: #1f2937 !important;
                    }
                  }
                `}</style>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
} 