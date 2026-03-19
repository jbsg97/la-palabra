"use client";

import { LargeButton } from "@/components/ui/LargeButton";
import { useTTS } from "@/hooks/useTTS";

interface DailyVerseData {
  text: string;
  bookName: string;
  chapter: number;
  verse: number;
}

interface DailyVerseProps {
  data: DailyVerseData | null;
}

export function DailyVerse({ data }: DailyVerseProps) {
  const { speak, cancel, isSpeaking } = useTTS();

  if (!data) {
    return (
      <div className="bg-card rounded-3xl p-6 shadow-app border border-app">
        <p className="text-muted text-center text-lg">Cargando versículo del día...</p>
      </div>
    );
  }

  const reference = `${data.bookName} ${data.chapter}:${data.verse}`;

  return (
    <div className="bg-card rounded-3xl p-6 shadow-app border border-app">
      <p className="text-accent font-semibold text-base mb-3">{reference}</p>
      <p className="text-app text-xl leading-relaxed mb-5">&ldquo;{data.text}&rdquo;</p>
      <LargeButton
        variant="secondary"
        size="md"
        onClick={() => (isSpeaking ? cancel() : speak(data.text))}
        aria-label={isSpeaking ? "Detener lectura" : "Escuchar versículo del día"}
      >
        <span aria-hidden="true">{isSpeaking ? "⏹" : "▶"}</span>
        {isSpeaking ? "Detener" : "Escuchar"}
      </LargeButton>
    </div>
  );
}
