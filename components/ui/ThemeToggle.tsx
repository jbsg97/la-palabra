"use client";

import { useSettingsStore, type Theme } from "@/lib/stores/settingsStore";

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Claro", icon: "☀️" },
  { value: "dark", label: "Oscuro", icon: "🌙" },
  { value: "high-contrast", label: "Alto contraste", icon: "◑" },
];

export function ThemeToggle() {
  const { theme, setTheme } = useSettingsStore();
  const currentIdx = THEMES.findIndex((t) => t.value === theme);
  const next = THEMES[(currentIdx + 1) % THEMES.length];

  return (
    <button
      onClick={() => setTheme(next.value)}
      aria-label={`Cambiar tema. Tema actual: ${THEMES[currentIdx].label}. Siguiente: ${next.label}`}
      className="min-h-[48px] min-w-[48px] flex items-center justify-center text-2xl rounded-xl active:opacity-70"
    >
      <span aria-hidden="true">{THEMES[currentIdx].icon}</span>
    </button>
  );
}
