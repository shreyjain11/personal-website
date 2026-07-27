"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((module) => module.Dithering),
  { ssr: false },
);

type BackgroundPreferences = {
  canUseWebGl: boolean;
  isDark: boolean;
  reduceMotion: boolean;
};

const initialPreferences: BackgroundPreferences = {
  canUseWebGl: false,
  isDark: false,
  reduceMotion: true,
};

function supportsWebGl() {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");

  context?.getExtension("WEBGL_lose_context")?.loseContext();
  return context !== null;
}

export function DitherBackground() {
  const [preferences, setPreferences] =
    useState<BackgroundPreferences>(initialPreferences);

  useEffect(() => {
    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dataQuery = window.matchMedia("(prefers-reduced-data: reduce)");
    const canUseWebGl = supportsWebGl();

    const updatePreferences = () => {
      setPreferences({
        canUseWebGl,
        isDark: darkQuery.matches,
        reduceMotion: motionQuery.matches || dataQuery.matches,
      });
    };

    updatePreferences();
    darkQuery.addEventListener("change", updatePreferences);
    motionQuery.addEventListener("change", updatePreferences);
    dataQuery.addEventListener("change", updatePreferences);

    return () => {
      darkQuery.removeEventListener("change", updatePreferences);
      motionQuery.removeEventListener("change", updatePreferences);
      dataQuery.removeEventListener("change", updatePreferences);
    };
  }, []);

  const colorBack = preferences.isDark ? "#101411" : "#f6f6f3";
  const colorFront = preferences.isDark ? "#75839d" : "#49566e";

  return (
    <div
      className="dither-backdrop"
      data-webgl={preferences.canUseWebGl ? "true" : "false"}
      aria-hidden="true"
    >
      <div className="dither-fallback" />
      {preferences.canUseWebGl ? (
        <Dithering
          className="dither-canvas"
          colorBack={colorBack}
          colorFront={colorFront}
          fit="none"
          height="100%"
          maxPixelCount={800_000}
          minPixelRatio={1}
          offsetX={0.14}
          offsetY={-0.24}
          rotation={-10}
          scale={0.92}
          shape="simplex"
          size={1.65}
          speed={preferences.reduceMotion ? 0 : 0.12}
          type="4x4"
          width="100%"
        />
      ) : null}
      <div className="dither-vignette" />
    </div>
  );
}
