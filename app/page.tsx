"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const TITLES = [
  "Computational Biologist",
  "Full Stack Developer",
  "Tech Visionary",
  "Problem Solver",
  "Entrepreneur",
  "AI Enthusiast",
  "Innovator",
  "Tech Enthusiast",
  "ML Researcher",
  "Creator",
  "Designer",
];

function useTypewriter(words: string[], speed = 80, pause = 1200) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [blink, setBlink] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (subIndex === words[index].length + 1 && !deleting) {
      timeoutRef.current = setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }
    timeoutRef.current = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? speed / 2 : speed);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [subIndex, index, deleting, words, speed, pause]);

  useEffect(() => {
    const blinkInterval = setInterval(() => setBlink((v) => !v), 500);
    return () => clearInterval(blinkInterval);
  }, []);

  return `${words[index].substring(0, subIndex)}${blink ? "|" : " "}`;
}

export default function Home() {
  const typewriter = useTypewriter(TITLES);
  const [imgHover, setImgHover] = useState(false);

  // Bio fade/cycle effect
  const bioSentences = [
    "Full-stack engineer & founder.",
    "Building AI products to create meaningful impact.",
    "Developing software to revolutionize medical care."
  ];
  const [bioIndex, setBioIndex] = useState(0);
  const [bioFade, setBioFade] = useState(true);

  const handleBioHover = () => {
    setBioFade(false);
    setTimeout(() => {
      setBioIndex((prev) => (prev + 1) % bioSentences.length);
      setBioFade(true);
    }, 200); // fade out duration
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter transition-colors duration-300">
      <main className="flex flex-row items-center justify-center flex-1 w-full px-4 max-w-5xl mx-auto gap-16">
        {/* Profile Image */}
        <div
          className={`rounded-xl shadow-lg w-60 h-60 transition-transform duration-300 ${imgHover ? "scale-140" : ""}`}
          style={{ overflow: "hidden" }}
          onMouseEnter={() => setImgHover(true)}
          onMouseLeave={() => setImgHover(false)}
        >
          <Image
            src="/Shrey Headshot.png"
            alt="Shrey Jain headshot"
            width={240}
            height={240}
            className="object-cover w-full h-full"
            priority
          />
        </div>
        {/* Bio and Socials */}
        <div className="flex flex-col items-start justify-center w-full max-w-xl">
          <h1 className="text-6xl font-extrabold mb-2 text-gray-900 dark:text-white">Shrey Jain</h1>
          <h2 className="text-3xl font-semibold text-gray-600 dark:text-gray-300 mb-4 h-10" style={{ minHeight: 40 }}>{typewriter}</h2>
          <div
            className={`text-xl mb-2 text-gray-800 dark:text-gray-200 transition-opacity duration-200 ${bioFade ? "opacity-100" : "opacity-0"}`}
            onMouseEnter={handleBioHover}
            style={{ cursor: "pointer" }}
          >
            {bioSentences[bioIndex]}
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
             Centennial High School Class of 2028
          </div>  
          {/* Socials */}
          <div className="flex gap-8 mt-2 mb-6">
            <a href="https://github.com/shreyjain11" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            </a>
            <a href="mailto:mailshreyjain@gmail.com" aria-label="Email" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M2 4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4zm2 0v.01L12 13l8-8.99V4H4zm16 2.41l-7.293 7.293a1 1 0 0 1-1.414 0L4 6.41V20h16V6.41z"/></svg>
            </a>
            <a href="https://x.com/jain11shrey" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775A4.932 4.932 0 0 0 23.337 3.1a9.864 9.864 0 0 1-3.127 1.195A4.916 4.916 0 0 0 16.616 3c-2.72 0-4.924 2.206-4.924 4.924 0 .386.044.763.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965a4.822 4.822 0 0 0-.666 2.475c0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89a4.936 4.936 0 0 1-2.224.084c.627 1.956 2.444 3.377 4.6 3.417A9.867 9.867 0 0 1 0 21.543a13.94 13.94 0 0 0 7.548 2.212c9.057 0 14.009-7.513 14.009-14.009 0-.213-.005-.425-.014-.636A10.012 10.012 0 0 0 24 4.557z"/></svg>
            </a>
          </div>
          {/* Nav Buttons */}
          <div className="flex gap-8 mt-2">
            <Link href="/" className="transition-all duration-300 hover:scale-105 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200">about</Link>
            <Link href="/work" className="transition-all duration-300 hover:scale-105 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200">work</Link>
            <Link href="/projects" className="transition-all duration-300 hover:scale-105 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200">projects</Link>
            <a href="/Shrey Jain Résumé (2).pdf" target="_blank" rel="noopener noreferrer" className="transition-all duration-300 hover:scale-105 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-800 dark:text-gray-200">resume</a>
          </div>
        </div>
      </main>
    </div>
  );
}
