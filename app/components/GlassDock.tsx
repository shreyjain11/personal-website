"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

/**
 * Floating liquid-glass navigation dock, shown on every page.
 *
 * Two effects are combined here:
 *
 *  1. The pill itself is real WebGL glass via @ybouane/liquidglass, which
 *     refracts the page content behind it. The pill must be a *direct child*
 *     of the LiquidGlass root (#lg-root in layout.tsx); the gradient + page
 *     are the other direct children that get refracted. The library is
 *     browser/WebGL-only, so it's dynamically imported inside an effect and
 *     never runs on the server. If WebGL/init fails, the `.lg-fallback` class
 *     keeps it looking like frosted glass.
 *
 *  2. A Vercel-style hover tooltip (recreated from Skiper UI's "skiper43"
 *     using `motion`) springs/slides between icons with a clip-path label
 *     reveal. It's rendered through a portal to <body> — i.e. OUTSIDE the
 *     LiquidGlass root — so its constant animation never triggers a glass
 *     re-capture. It's styled as frosted glass to blend with the pill.
 */

const ease = [0.25, 0.46, 0.45, 0.94] as const;

type Hover = { x: number; y: number; label: string };

export function GlassDock() {
  const dockRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hover, setHover] = useState<Hover | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const root = document.getElementById("lg-root");
    const dock = dockRef.current;
    if (!root || !dock) return;

    // WebGL liquid glass is heavy and renders unreliably on mobile (esp. iOS
    // Safari), so on small screens we skip it and keep the lightweight CSS
    // frosted fallback (.lg-fallback stays applied).
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let instance: { destroy: () => void; markChanged: () => void } | undefined;
    let raf = 0;
    let cancelled = false;

    // Coalesce scroll/resize bursts into one markChanged per frame.
    const mark = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        instance?.markChanged();
      });
    };

    (async () => {
      try {
        // Fonts must be loaded before the dock's text is rasterized.
        await document.fonts?.ready;
        if (cancelled) return;

        const { LiquidGlass } = await import("@ybouane/liquidglass");
        if (cancelled) return;

        // Drop the CSS fallback so its background isn't captured into the glass.
        dock.classList.remove("lg-fallback");

        instance = await LiquidGlass.init({
          root,
          glassElements: [dock],
          defaults: {
            blurAmount: 0.16,
            refraction: 0.9,
            chromAberration: 0.1,
            // Bright contributors kept low so the pill doesn't glow with a
            // white rim/specular bar (very visible in dark mode).
            edgeHighlight: 0.04,
            specular: 0.08,
            fresnel: 0.25,
            distortion: 0.12,
            saturation: 0.1,
            tintStrength: 0.1,
            zRadius: 52,
            cornerRadius: 28,
            shadowOpacity: 0.22,
            shadowSpread: 14,
            shadowOffsetY: 6,
          },
        });
        if (cancelled) {
          instance.destroy();
          return;
        }

        window.addEventListener("scroll", mark, { passive: true });
        window.addEventListener("resize", mark);
      } catch (err) {
        console.warn("LiquidGlass unavailable; using CSS fallback", err);
        dock.classList.add("lg-fallback");
      }
    })();

    return () => {
      cancelled = true;
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", mark);
      window.removeEventListener("resize", mark);
      instance?.destroy();
    };
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Move the shared tooltip to whichever icon the pointer is over. Delegated
  // via [data-tip] so both internal links and external anchors are covered.
  const onMove = (e: React.MouseEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-tip]");
    if (!el) return;
    const label = el.getAttribute("data-tip") ?? "";
    const r = el.getBoundingClientRect();
    setHover((h) =>
      h && h.label === label
        ? h
        : { x: r.left + r.width / 2, y: r.bottom + 10, label },
    );
  };

  return (
    <>
      <nav
        ref={dockRef}
        aria-label="Site navigation"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        className="lg-fallback fixed top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50 flex h-14 items-center gap-0.5 px-2 md:gap-1 md:px-2.5 rounded-full"
      >
        {/* Links sit above the WebGL canvas the library injects, so they stay
            crisp and clickable. */}
        <DockLink href="/" label="Home" active={isActive("/")}>
          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 10.5 12 3l9 7.5" />
            <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
          </svg>
        </DockLink>

        <DockLink href="/work" label="Work" active={isActive("/work")}>
          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="7" width="18" height="13" rx="2" />
            <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" />
          </svg>
        </DockLink>

        <DockLink href="/projects" label="Projects" active={isActive("/projects")}>
          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <rect x="3" y="4" width="7.5" height="7.5" rx="1.5" />
            <rect x="13.5" y="4" width="7.5" height="7.5" rx="1.5" />
            <rect x="3" y="14" width="7.5" height="6" rx="1.5" />
            <rect x="13.5" y="14" width="7.5" height="6" rx="1.5" />
          </svg>
        </DockLink>

        <span className="mx-1 h-6 w-px bg-foreground/15" aria-hidden />

        <DockExternal href="https://github.com/shreyjain11" label="GitHub">
          <svg width="19" height="19" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </DockExternal>

        <DockExternal href="https://x.com/jain11shrey" label="Twitter / X">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </DockExternal>

        <DockExternal href="mailto:mailshreyjain@gmail.com" label="Email">
          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </DockExternal>

        <DockExternal href="https://scholar.google.com/citations?user=J9MEbCsAAAAJ&hl=en" label="Scholar">
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 10a8 8 0 0 1 7.162 3.44L24 9.5z" />
          </svg>
        </DockExternal>
      </nav>

      {/* Vercel-style tooltip (skiper43), portaled outside #lg-root so its
          animation never triggers a LiquidGlass re-capture. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {hover && (
              <motion.div
                key="lg-tip"
                className="pointer-events-none fixed left-0 top-0 z-[60]"
                initial={{ opacity: 0, scale: 0.9, x: hover.x, y: hover.y }}
                animate={{ opacity: 1, scale: 1, x: hover.x, y: hover.y }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  x: { type: "spring", stiffness: 560, damping: 34, mass: 0.7 },
                  y: { type: "spring", stiffness: 560, damping: 34, mass: 0.7 },
                  opacity: { duration: 0.14 },
                  scale: { duration: 0.18, ease: [0.34, 1.56, 0.64, 1] },
                }}
              >
                {/* plain wrapper handles horizontal centering so it never
                    fights motion's transform on the layers above/below */}
                <div className="-translate-x-1/2">
                  <motion.div layout className="lg-tooltip">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={hover.label}
                        className="block whitespace-nowrap"
                        initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0, filter: "blur(3px)" }}
                        animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1, filter: "blur(0px)" }}
                        exit={{ clipPath: "inset(100% 0 0 0)", opacity: 0, filter: "blur(3px)" }}
                        transition={{ duration: 0.2, ease }}
                      >
                        {hover.label}
                      </motion.span>
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}

function DockLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      data-tip={label}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`relative z-[1] flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full transition-colors duration-200 ${
        active ? "text-foreground" : "text-foreground/55 hover:text-foreground"
      }`}
    >
      {children}
    </Link>
  );
}

function DockExternal({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      data-tip={label}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="relative z-[1] flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-full text-foreground/55 hover:text-foreground transition-colors duration-200"
    >
      {children}
    </a>
  );
}
