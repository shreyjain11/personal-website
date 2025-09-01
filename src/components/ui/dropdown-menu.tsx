"use client";
import * as React from "react";

type DropdownMenuContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
};

const DropdownMenuContext = React.createContext<DropdownMenuContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ className, children }: { className?: string; children: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  return (
    <button
      type="button"
      className={className}
      onClick={() => ctx.setOpen(!ctx.open)}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
    >
      {children}
    </button>
  );
}

export function DropdownMenuContent({ align = "end", children }: { align?: "start" | "end"; children: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  if (!ctx.open) return null;
  return (
    <div
      role="menu"
      className={`absolute mt-2 min-w-40 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-1 z-50 ${
        align === "start" ? "left-0" : "right-0"
      }`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ onSelect, children }: { onSelect?: () => void; children: React.ReactNode }) {
  const ctx = React.useContext(DropdownMenuContext)!;
  return (
    <button
      type="button"
      role="menuitem"
      className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
      onClick={() => {
        onSelect?.();
        ctx.setOpen(false);
      }}
    >
      {children}
    </button>
  );
}


