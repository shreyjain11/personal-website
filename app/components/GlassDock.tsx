"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pageLinks = [
  { href: "/work", label: "Work" },
  { href: "/projects", label: "Projects" },
] as const;

export function GlassDock() {
  const pathname = usePathname();

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav__inner">
        <Link
          className="site-nav__brand"
          href="/"
          aria-label="Shrey Jain — home"
          aria-current={pathname === "/" ? "page" : undefined}
        >
          Shrey Jain
        </Link>
        <div className="site-nav__pages">
          {pageLinks.map((link) => (
            <Link
              className="site-nav__link"
              href={link.href}
              key={link.href}
              aria-current={
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "page"
                  : undefined
              }
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
