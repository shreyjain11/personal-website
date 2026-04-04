import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { VisitCounter } from "./components/VisitCounter";
import { StarField } from "./components/StarField";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Shrey Jain",
  description: "Computational biology researcher at the Eric and Wendy Schmidt Center. Building AI products to create meaningful impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased relative`}>
        <SpeedInsights />
        <StarField />
        <div className="relative z-10">
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <AppBreadcrumb />
          </div>
          {children}
        </div>
        <VisitCounter />
      </body>
    </html>
  );
}
