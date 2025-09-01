"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  // Grid density
  const rows = useMemo(() => new Array(60).fill(1), []);
  const cols = useMemo(() => new Array(60).fill(1), []);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const colors = [
    "#93c5fd",
    "#f9a8d4",
    "#86efac",
    "#fde047",
    "#fca5a5",
    "#d8b4fe",
    "#93c5fd",
    "#a5b4fc",
    "#c4b5fd",
  ];
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // mouse relative to container center (after CSS transforms)
      const x3 = e.clientX - (rect.left + rect.width / 2);
      const y3 = e.clientY - (rect.top + rect.height / 2);

      // Invert CSS transform: skewX(-36deg) skewY(12deg) scale(0.9)
      const tX = Math.tan((-36 * Math.PI) / 180);
      const tY = Math.tan((12 * Math.PI) / 180);
      const s = 0.9;

      const xUn = (x3 - tX * y3) / s;
      const yUn = (-tY * x3 + (1 + tX * tY) * y3) / s;

      // shift back to top-left of the untransformed virtual grid
      const Wg = cols.length * cellW;
      const Hg = rows.length * cellH;
      setMouse({ x: xUn + Wg / 2, y: yUn + Hg / 2 });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [cols.length, rows.length]);

  // Cell sizes match classes h-8 (32px) w-16 (64px) before transforms
  const cellW = 64;
  const cellH = 32;

  return (
    <div
      style={{
        transform: `skewX(-36deg) skewY(12deg) scale(0.9) translateZ(0)`,
      }}
      className={cn(
        "pointer-events-none absolute top-1/2 left-1/2 z-40 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4",
        className,
      )}
      ref={containerRef}
      {...rest}
    >
      {/* soft radial gradient to ensure visibility on dark bg */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.06)_0%,rgba(0,0,0,0)_60%)]" />
      {rows.map((_, i) => (
        <motion.div
          key={`row` + i}
          className="relative h-8 w-16 border-l border-white/10"
        >
          {cols.map((_, j) => (
            <motion.div
              animate={{
                backgroundColor:
                  Math.abs(mouse.x - (j + 0.5) * cellW) < cellW / 2 &&
                  Math.abs(mouse.y - (i + 0.5) * cellH) < cellH / 2
                    ? getRandomColor()
                    : "rgba(0,0,0,0)",
                transition: { duration: 0.12 },
              }}
              key={`col` + j}
              className="relative h-8 w-16 border-t border-r border-white/10"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="pointer-events-none absolute -top-[14px] -left-[22px] h-6 w-10 stroke-[1px] text-white/10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m6-6H6"
                  />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);


