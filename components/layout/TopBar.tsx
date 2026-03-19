"use client";

import { FontSizeControl } from "@/components/ui/FontSizeControl";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface TopBarProps {
  title: string;
  actions?: React.ReactNode;
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 bg-nav border-b border-app shadow-app"
      role="banner"
    >
      <div className="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto w-full">
        <h1 className="text-xl font-bold text-app truncate flex-1 mr-2">{title}</h1>
        <div className="flex items-center gap-1 shrink-0">
          {actions}
          <FontSizeControl />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
