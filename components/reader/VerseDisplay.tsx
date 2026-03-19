"use client";

import type { BibleChapter } from "@/lib/bible/types";
import { useSettingsStore } from "@/lib/stores/settingsStore";

interface VerseDisplayProps {
  chapter: BibleChapter | null;
  isLoading: boolean;
}

export function VerseDisplay({ chapter, isLoading }: VerseDisplayProps) {
  const fontSize = useSettingsStore((s) => s.fontSize);

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted text-xl animate-pulse">Cargando...</p>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted text-xl">
          Descargue los datos bíblicos primero ejecutando:{" "}
          <code className="bg-secondary px-2 py-1 rounded">npm run download-bible</code>
        </p>
      </div>
    );
  }

  return (
    <div className={`font-reader-${fontSize} text-app`}>
      {chapter.verses.map((verse) => (
        <span key={verse.verse} className="inline">
          <sup className="text-accent font-bold mr-1 select-none" style={{ fontSize: "0.6em" }}>
            {verse.verse}
          </sup>
          {verse.text}{" "}
        </span>
      ))}
    </div>
  );
}
