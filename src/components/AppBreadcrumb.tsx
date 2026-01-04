"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



export function AppBreadcrumb() {
  const pathname = usePathname();

  // Normalize path segments, e.g., "/projects" -> ["projects"]
  const segments = pathname
    .split("/")
    .filter(Boolean);

  const last = segments[segments.length - 1] ?? "";

  // Hide breadcrumb on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">shrey</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.length > 0 && <BreadcrumbSeparator />}

        {segments.length > 1 && (
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/${segments[0]}`}>{segments[0]}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        )}

        {segments.length > 0 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem>
                    <Link href="/">about</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/work">work</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/projects">projects</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

                {segments.length > 0 && (
          <BreadcrumbItem>
            <BreadcrumbPage>{last || "about"}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}


