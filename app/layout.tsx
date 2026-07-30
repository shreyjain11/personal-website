import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { VisitCounter } from "./components/VisitCounter";
import { GlassDock } from "./components/GlassDock";
import { DitherBackground } from "./components/DitherBackground";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Shrey Jain",
  description: "AI/ML research at Sabeti Lab at the Broad Institute.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} font-sans antialiased relative`}>
        <SpeedInsights />
        <div className="site-root">
          <DitherBackground />
          <div className="site-content">
            {children}
          </div>
          <GlassDock />
        </div>
        <VisitCounter />
      </body>
    </html>
  );
}
