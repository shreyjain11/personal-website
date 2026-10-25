"use client";

// EasyUI chart helpers used by ActivityHeatmap. See EASYUI-LICENSE.txt.

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { motion, useReducedMotion, useSpring } from "motion/react";

/* -------------------------------------------------------------------------- */
/*  Shared chart primitives                                                    */
/*                                                                             */
/*  Used by BarChart, DonutChart and ActivityHeatmap. Kept in src/lib so the   */
/*  registry generator ships it as a shared `registry:lib` dependency.         */
/* -------------------------------------------------------------------------- */

export const CHART_COLORS = ["#6d7cff", "#34d1bf", "#ffb44c", "#ff6b8b", "#a78bfa", "#5ac8fa"];

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const SPRING = { type: "spring", duration: 0.5, bounce: 0 } as const;

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");

const compactFmt = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
export const fullFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });
export const defaultFormat = (n: number) => fullFmt.format(n);
export const defaultTick = (n: number) => compactFmt.format(n);

export const ring = "ring-1 ring-foreground/10";
export const muted = "text-foreground/55";
export const focus =
  "outline-none focus-visible:ring-2 focus-visible:ring-neutral-400/70 dark:focus-visible:ring-white/40";

// "Nice" step so that step × 4 covers `raw × 4`
export function niceStep(raw: number) {
  if (!(raw > 0) || !isFinite(raw)) return 1;
  const exp = Math.floor(Math.log10(raw));
  const base = raw / 10 ** exp;
  const nice = base <= 1 ? 1 : base <= 2 ? 2 : base <= 2.5 ? 2.5 : base <= 5 ? 5 : 10;
  return nice * 10 ** exp;
}

/** Container width via ResizeObserver (initial value keeps SSR output sensible) */
export function useElementWidth<T extends HTMLElement>(initial: number) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(initial);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(Math.round(el.clientWidth) || initial);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [initial]);
  return [ref, width] as const;
}

/** Clear a hover/tap selection when the user taps outside the chart (touch) */
export function useDismissOutside(ref: RefObject<HTMLElement | null>, open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", down);
    return () => document.removeEventListener("pointerdown", down);
  }, [ref, open, close]);
}

/* ---------------------------------- Tooltip -------------------------------- */

export function Tooltip({
  pos,
  boundsWidth,
  children,
}: {
  pos: { x: number; y: number } | null;
  boundsWidth: number;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const x = useSpring(0, { stiffness: 520, damping: 42, mass: 0.6 });
  const y = useSpring(0, { stiffness: 520, damping: 42, mass: 0.6 });

  useLayoutEffect(() => {
    if (!pos) {
      seen.current = false;
      return;
    }
    const w = ref.current?.offsetWidth ?? 130;
    const h = ref.current?.offsetHeight ?? 60;
    const tx = clamp(pos.x - w / 2, 0, Math.max(0, boundsWidth - w));
    let ty = pos.y - h - 12;
    if (ty < 0) ty = pos.y + 18;
    if (!seen.current || reduceMotion) {
      x.jump(tx);
      y.jump(ty);
      seen.current = true;
    } else {
      x.set(tx);
      y.set(ty);
    }
  }, [pos, boundsWidth, x, y, children, reduceMotion]);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute left-0 top-0 z-20 min-w-[112px] rounded-xl bg-background/95 px-3 py-2 text-[12px] shadow-lg backdrop-blur ${ring}`}
      style={{ x, y }}
      initial={false}
      animate={{ opacity: pos ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.14, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
