"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppBreadcrumb() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <nav>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white/70 transition-colors duration-300"
      >
        <svg
          width="13" height="13" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        shrey
      </Link>
    </nav>
  );
}
