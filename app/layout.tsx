import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";

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
            <footer className="site-footer">
              <p className="footer-note">
                reach out at{" "}
                <a className="footer-address" href="mailto:jainshre@broadinstitute.org">
                  jainshre at broadinstitute dot org
                </a>
              </p>
            </footer>
          </div>
          <GlassDock />
        </div>
      </body>
    </html>
  );
}
