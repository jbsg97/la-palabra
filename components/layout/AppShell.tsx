"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { BottomNav } from "./BottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const theme = useSettingsStore((s) => s.theme);

  // Apply theme class to <html>
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark", "theme-high-contrast");
    html.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <div className="flex flex-col min-h-screen">
      <main
        className="flex-1 pb-[64px] overflow-y-auto"
        id="main-content"
      >
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
