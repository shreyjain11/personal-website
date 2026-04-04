"use client";

import Image from "next/image";
import Link from "next/link";
import { GitHubContributions } from "./components/GitHubContributions";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Home() {
  const [konamiIdx, setKonamiIdx] = useState(0);
  const [secret, setSecret] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);

  // Console easter egg
  useEffect(() => {
    console.log(
      '%c  👋 hey there  ',
      'background:#1e1b4b;color:#a5b4fc;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:6px;'
    );
    console.log(
      '%cyou found something. want to build together?\n→ mailshreyjain@gmail.com',
      'color:#64748b;font-size:13px;'
    );
  }, []);

  // Konami code
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI[konamiIdx]) {
        const next = konamiIdx + 1;
        if (next === KONAMI.length) {
          setSecret(true);
          setKonamiIdx(0);
          setTimeout(() => setSecret(false), 4000);
        } else {
          setKonamiIdx(next);
        }
      } else {
        setKonamiIdx(e.key === KONAMI[0] ? 1 : 0);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [konamiIdx]);

  const onPhotoMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * 14, y: -x * 14 });
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-100 font-inter">

      {/* Konami easter egg */}
      <AnimatePresence>
        {secret && (
          <motion.div
            key="secret"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.45, ease }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
          >
            <div className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10">
              <p className="text-sm text-white/60 tracking-[0.18em] uppercase whitespace-nowrap">
                ✦ &nbsp; developer mode unlocked
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col md:flex-row items-center justify-center flex-1 w-full px-4 max-w-5xl mx-auto gap-10 md:gap-20 py-12 md:py-24">

        {/* Profile Image with 3D tilt */}
        <motion.div
          className="shrink-0"
          style={{ perspective: '800px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <div
            className="h-40 w-40 md:h-52 md:w-52 rounded-full ring-1 ring-white/10 overflow-hidden shadow-2xl cursor-default"
            style={{
              transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: hovering
                ? 'transform 0.08s ease-out'
                : 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onMouseMove={onPhotoMove}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovering(false); }}
          >
            <Image
              src="/Shrey Headshot.png"
              alt="Shrey Jain"
              width={208}
              height={208}
              className="object-cover w-full h-full"
              priority
            />
          </div>
        </motion.div>

        {/* Bio and Socials */}
        <motion.div
          className="flex flex-col items-center md:items-start justify-center w-full max-w-lg text-center md:text-left"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.12, ease }}
        >
          <h1
            className="text-5xl font-medium text-white tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', marginBottom: '18px' }}
          >
            Shrey Jain
          </h1>

          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-white/35 mb-8">
            Researcher &nbsp;·&nbsp; Engineer &nbsp;·&nbsp; Builder
          </p>

          <p className="text-[15px] text-white/60 leading-relaxed mb-3">
            Computational biology researcher at the Eric and Wendy Schmidt Center.
            Building AI products to create meaningful impact.
          </p>
          <p className="text-sm text-white/30 mb-9">
            Centennial High School &mdash; Class of 2028
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-5 mb-9">
            <a href="https://github.com/shreyjain11" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
              className="text-white/35 hover:text-white transition-colors duration-200">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
            <a href="https://x.com/jain11shrey" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X"
              className="text-white/35 hover:text-white transition-colors duration-200">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="mailto:mailshreyjain@gmail.com" aria-label="Email"
              className="text-white/35 hover:text-white transition-colors duration-200">
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </a>
          </div>

          {/* Nav */}
          <div className="flex gap-6 text-white/35">
            <Link href="/work" className="text-sm font-medium hover:text-white transition-colors duration-200">work</Link>
            <Link href="/projects" className="text-sm font-medium hover:text-white transition-colors duration-200">projects</Link>
          </div>
        </motion.div>
      </main>

      {/* GitHub Contributions */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-8 pb-20 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease }}
      >
        <GitHubContributions username="shreyjain11" />
      </motion.section>
    </div>
  );
}
