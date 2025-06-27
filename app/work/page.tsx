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
    company: "MindMesh",
    logo: "/MindMeshLogo.png",
    url: "https://aimindmesh.netlify.app/",
    title: "Founder & Lead Developer",
    description: "Built an AI-powered mind mapping platform from scratch.",
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
        <h1 className="text-4xl font-bold mb-8 text-left">work</h1>
        <div className="flex flex-col w-full">
          {workExperiences.map((work) => (
            <a
              key={work.company}
              href={work.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full py-3 px-2 rounded-lg transition-all duration-300 hover:bg-gray-100 hover:shadow-sm hover:scale-105 group"
            >
              <div className="flex-shrink-0 mr-4">
                <Image src={work.logo} alt={work.company + ' Logo'} width={48} height={48} className="rounded-lg object-cover w-12 h-12" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">{work.company}</span>
                <span className="text-base text-gray-700 font-medium">{work.title}</span>
                <span className="text-sm text-gray-600 mt-0.5">{work.description}</span>
              </div>
            </a>
          ))}
        </div>
        {/* Accolades Section */}
        <h2 className="text-2xl font-bold mt-12 mb-4 text-left">accolades</h2>
        <div className="flex flex-col w-full">
          {accolades.map((accolade) =>
            accolade.url ? (
              <a
                key={accolade.name}
                href={accolade.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center w-full py-2 px-2 rounded-lg cursor-pointer text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image src={accolade.logo} alt={accolade.name + ' Logo'} width={40} height={40} className="rounded-lg object-cover w-10 h-10" />
                </div>
                {accolade.name}
              </a>
            ) : (
              <div
                key={accolade.name}
                className="flex items-center w-full py-2 px-2 rounded-lg cursor-pointer text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
              >
                <div className="flex-shrink-0 mr-4">
                  <Image src={accolade.logo} alt={accolade.name + ' Logo'} width={40} height={40} className="rounded-lg object-cover w-10 h-10" />
                </div>
                {accolade.name}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
} 