"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Translation } from "@/lib/bible/types";

export type FontSize = "md" | "lg" | "xl" | "2xl";
export type Theme = "light" | "dark" | "high-contrast";

const FONT_SIZES: FontSize[] = ["md", "lg", "xl", "2xl"];

interface SettingsState {
  fontSize: FontSize;
  theme: Theme;
  translation: Translation;
  ttsRate: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
  setTheme: (theme: Theme) => void;
  setTranslation: (translation: Translation) => void;
  setTtsRate: (rate: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      fontSize: "lg",
      theme: "light",
      translation: "rvr60",
      ttsRate: 0.9,

      increaseFontSize: () => {
        const idx = FONT_SIZES.indexOf(get().fontSize);
        if (idx < FONT_SIZES.length - 1) {
          set({ fontSize: FONT_SIZES[idx + 1] });
        }
      },

      decreaseFontSize: () => {
        const idx = FONT_SIZES.indexOf(get().fontSize);
        if (idx > 0) {
          set({ fontSize: FONT_SIZES[idx - 1] });
        }
      },

      setTheme: (theme) => set({ theme }),
      setTranslation: (translation) => set({ translation }),
      setTtsRate: (ttsRate) => set({ ttsRate }),
    }),
    {
      name: "la-palabra-settings",
    }
  )
);
