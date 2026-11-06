import type { Metadata } from "next";
import Link from "next/link";
import styles from "./thoughts.module.css";

export const metadata: Metadata = {
  title: "Thoughts — Shrey Jain",
  description: "Notes on learning, science, and figuring things out.",
  alternates: { canonical: "https://jainshrey.com/thoughts" },
};

export default function Thoughts() {
  return (
    <main className="page-shell">
      <div>
        <header className={`content-haze collection-header lg-rise ${styles.indexHaze}`}>
          <p className="page-eyebrow">Writing</p>
          <h1 className="page-title">Thoughts</h1>
          <p className="page-lede">
            Reflections on learning, science, and the life I’m living.
          </p>
        </header>

        <ul className={`content-haze entry-list ${styles.indexHaze}`} aria-label="Posts">
          <li className="lg-rise" style={{ animationDelay: "0.12s" }}>
            <Link
              href="/thoughts/figuring-things-out"
              className="group entry-link entry-link--work"
            >
              <div className="min-w-0">
                <h2 className="entry-title">
                  <span className="entry-name">Figuring things out</span>
                </h2>
                <p className="entry-description">
                  A reminder to question answers and test ideas myself.
                </p>
              </div>
              <time className="entry-date" dateTime="2026-11">
                November 2026
              </time>
            </Link>
          </li>
        </ul>
      </div>
    </main>
  );
}
