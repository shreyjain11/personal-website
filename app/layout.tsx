import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SpeedInsights } from "@vercel/speed-insights/next"

import { AppBreadcrumb } from "@/components/AppBreadcrumb";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "Shrey Jain | Personal Website",
  description: "Full-stack engineer & founder. Building AI products to create meaningful impact.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased relative`}> 
        <SpeedInsights />
        <ThemeProvider>

          <div className="relative z-10">
            <div className="max-w-5xl mx-auto px-4 pt-6">
              <AppBreadcrumb />
            </div>
            {children}
          </div>
        </ThemeProvider> 
      </body>
    </html>
  );
}
