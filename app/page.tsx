"use client";

import Image from "next/image";
import { GitHubContributions } from "./components/GitHubContributions";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function Home() {
  const [konamiIndex, setKonamiIndex] = useState(0);
  const [secret, setSecret] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    console.log(
      "%c  👋 hey there  ",
      "background:#1e1b4b;color:#a5b4fc;font-size:16px;font-weight:bold;padding:8px 16px;border-radius:6px;",
    );
    console.log(
      "%cyou found something. want to build together?\n→ mailshreyjain@gmail.com",
      "color:#64748b;font-size:13px;",
    );
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === KONAMI[konamiIndex]) {
        const nextIndex = konamiIndex + 1;

        if (nextIndex === KONAMI.length) {
          setSecret(true);
          setKonamiIndex(0);
        } else {
          setKonamiIndex(nextIndex);
        }
      } else {
        setKonamiIndex(event.key === KONAMI[0] ? 1 : 0);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [konamiIndex]);

  useEffect(() => {
    if (!secret) return;

    const timeout = window.setTimeout(() => setSecret(false), 4000);
    return () => window.clearTimeout(timeout);
  }, [secret]);

  return (
    <main className="page-shell">
      <AnimatePresence>
        {secret ? (
          <motion.div
            className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full border border-foreground/10 bg-background/70 px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/60 backdrop-blur-xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, ease }}
          >
            ✦ developer mode unlocked
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.section
        className="content-haze"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.78, ease }}
        aria-labelledby="home-title"
      >
        <div className="flex items-center gap-5 sm:gap-7">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[1.15rem] border border-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:h-24 sm:w-24">
            <Image
              src="/Shrey Headshot.png"
              alt="Shrey Jain"
              fill
              sizes="(max-width: 640px) 80px, 96px"
              className="object-cover"
              priority
            />
          </div>

          <div>
            <p className="page-eyebrow">AI / ML Researcher</p>
            <h1 id="home-title" className="page-title">Shrey Jain</h1>
          </div>
        </div>

        <p className="page-lede">
          I work at the intersection of machine learning and computational biology at the{" "}
          <a
            className="underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground/70"
            href="https://www.ericandwendyschmidtcenter.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Eric and Wendy Schmidt Center
          </a>{" "}
          at the Broad Institute.
        </p>

      </motion.section>

      <motion.section
        className="content-haze mt-20 sm:mt-24"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.78, delay: reduceMotion ? 0 : 0.18, ease }}
        aria-labelledby="contributions-title"
      >
        <div className="mb-7 flex items-end justify-between gap-4 border-b border-foreground/10 pb-4">
          <h2 id="contributions-title" className="section-heading">GitHub activity</h2>
          <a
            className="text-xs text-foreground/45 transition-colors hover:text-foreground"
            href="https://github.com/shreyjain11"
            target="_blank"
            rel="noopener noreferrer"
          >
            @shreyjain11 ↗
          </a>
        </div>
        <GitHubContributions username="shreyjain11" hideHeading />
      </motion.section>
    </main>
  );
}
