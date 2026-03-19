"use client";

import { useSettingsStore } from "@/lib/stores/settingsStore";

export function FontSizeControl() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useSettingsStore();
  const isMin = fontSize === "md";
  const isMax = fontSize === "2xl";

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Tamaño de fuente">
      <button
        onClick={decreaseFontSize}
        disabled={isMin}
        aria-label="Reducir tamaño de fuente"
        className="min-h-[48px] min-w-[48px] flex items-center justify-center text-app font-bold text-lg rounded-xl active:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        A<span className="text-xs align-sub">−</span>
      </button>
      <button
        onClick={increaseFontSize}
        disabled={isMax}
        aria-label="Aumentar tamaño de fuente"
        className="min-h-[48px] min-w-[48px] flex items-center justify-center text-app font-bold text-xl rounded-xl active:opacity-70 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        A<span className="text-xs align-super">+</span>
      </button>
    </div>
  );
}
