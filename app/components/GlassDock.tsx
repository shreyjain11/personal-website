"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

const pageLinks = [
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
] as const;

export function GlassDock() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [emailVisible, setEmailVisible] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    setEmailVisible(false);
    setEmailCopied(false);
  }, [pathname]);

  useEffect(() => {
    if (!emailCopied) return;

    const timeout = window.setTimeout(() => setEmailCopied(false), 1600);
    return () => window.clearTimeout(timeout);
  }, [emailCopied]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("mailshreyjain@gmail.com");
      setEmailCopied(true);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__inner">
        <Link className="site-nav__brand" href="/" aria-label="Shrey Jain — home">
          SJ
        </Link>

        <div className="site-nav__pages">
          {pageLinks.map((link) => (
            <Link
              className="site-nav__link"
              href={link.href}
              key={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="site-nav__external">
          <span className="site-nav__divider" aria-hidden="true" />
          <ExternalLink href="https://github.com/shreyjain11" label="GitHub">
            <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3Z" />
            </svg>
          </ExternalLink>

          <button
            className="site-nav__icon"
            type="button"
            aria-label={emailVisible ? "Hide email address" : "Reveal email address"}
            aria-expanded={emailVisible}
            aria-controls="email-reveal"
            onClick={() => setEmailVisible((visible) => !visible)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m3 7 7.9 5.3a2 2 0 0 0 2.2 0L21 7" />
              <rect x="3" y="5" width="18" height="14" rx="2" />
            </svg>
          </button>

          <span className="site-nav__optional">
            <ExternalLink href="https://x.com/jain11shrey" label="X">
              <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.2 2.3h3.3l-7.2 8.2 8.5 11.2h-6.7l-4.7-6.2L6 21.7H2.7l7.8-8.8-9.3-10.6h6.9l4.2 5.6 5.9-5.6Zm-1.1 17.5h1.8L7.1 4.1H5.2l11.9 15.7Z" />
              </svg>
            </ExternalLink>
          </span>

          <span className="site-nav__optional">
            <ExternalLink
              href="https://scholar.google.com/citations?user=J9MEbCsAAAAJ&hl=en"
              label="Google Scholar"
            >
              <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14Zm0-24L0 9.5l4.8 3.9A8 8 0 0 1 12 10a8 8 0 0 1 7.2 3.4L24 9.5 12 0Z" />
              </svg>
            </ExternalLink>
          </span>
        </div>
      </div>

      <AnimatePresence>
        {emailVisible ? (
          <motion.div
            id="email-reveal"
            className="email-reveal"
            initial={{ opacity: 0, y: -8, scale: 0.96, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -5, scale: 0.97, filter: "blur(4px)" }}
            transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            aria-live="polite"
          >
            <span className="email-reveal__address">mailshreyjain@gmail.com</span>
            <button
              className="email-reveal__copy"
              type="button"
              onClick={copyEmail}
              aria-label="Copy email address"
            >
              {emailCopied ? "Copied" : "Copy"}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </nav>
  );
}

function ExternalLink({
  children,
  href,
  label,
}: {
  children: React.ReactNode;
  href: string;
  label: string;
}) {
  return (
    <a
      className="site-nav__icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      {children}
    </a>
  );
}
