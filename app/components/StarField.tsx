"use client";
import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  base: number;
  speed: number;
  phase: number;
}

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let frame = 0;
    const stars: Star[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      buildStars();
    };

    const buildStars = () => {
      stars.length = 0;
      const count = Math.floor((canvas.width * canvas.height) / 5500);
      for (let i = 0; i < count; i++) {
        const big = Math.random() < 0.08;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: big ? Math.random() * 0.9 + 0.9 : Math.random() * 0.5 + 0.15,
          base: big ? Math.random() * 0.5 + 0.3 : Math.random() * 0.35 + 0.08,
          speed: Math.random() * 0.5 + 0.15,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      const t = frame * 0.015;

      for (const s of stars) {
        const alpha = s.base * (0.55 + 0.45 * Math.sin(t * s.speed + s.phase));

        if (s.r > 0.9) {
          // Soft glow for brighter stars
          const glow = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
          glow.addColorStop(0, `rgba(200,210,255,${alpha * 0.6})`);
          glow.addColorStop(1, "rgba(200,210,255,0)");
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,225,255,${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, opacity: 0.75 }}
    />
  );
}
