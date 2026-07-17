"use client";

import Image from "next/image";
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
    <div className="min-h-screen flex flex-col text-foreground font-inter">

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
            <div className="px-6 py-3 rounded-full bg-foreground/5 backdrop-blur-md border border-foreground/10">
              <p className="text-sm text-foreground/60 tracking-[0.18em] uppercase whitespace-nowrap">
                ✦ &nbsp; developer mode unlocked
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex flex-col md:flex-row items-center justify-center flex-1 w-full px-5 max-w-5xl mx-auto gap-10 md:gap-20 pt-32 pb-16 md:py-24">

        {/* Profile Image with 3D tilt */}
        <motion.div
          className="shrink-0"
          style={{ perspective: '800px' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          <div
            className="h-40 w-40 md:h-52 md:w-52 rounded-full ring-1 ring-foreground/20 overflow-hidden shadow-lg cursor-default"
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
            className="text-5xl font-medium text-foreground tracking-tight leading-none"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', marginBottom: '18px' }}
          >
            Shrey Jain
          </h1>

          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-foreground/45 mb-8">
            Researcher &nbsp;·&nbsp; Engineer &nbsp;·&nbsp; Builder
          </p>

          <p className="text-[15px] text-foreground/60 leading-relaxed">
            Computational biology researcher at the Eric and Wendy Schmidt Center.
            Building AI products to create meaningful impact.
          </p>
        </motion.div>
      </main>

      {/* GitHub Contributions */}
      <motion.section
        className="w-full max-w-4xl mx-auto px-5 sm:px-8 pb-24 sm:pb-20 overflow-hidden"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease }}
      >
        <GitHubContributions username="shreyjain11" />
      </motion.section>
    </div>
  );
}
