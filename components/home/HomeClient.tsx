"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDailyVerse } from "@/lib/bible";
import { DailyVerse } from "./DailyVerse";
import { LargeButton } from "@/components/ui/LargeButton";
import { useCompanionStore } from "@/lib/stores/companionStore";

interface DailyVerseData {
  text: string;
  bookName: string;
  chapter: number;
  verse: number;
}

export function HomeClient() {
  const [dailyVerse, setDailyVerse] = useState<DailyVerseData | null>(null);
  const openCompanion = useCompanionStore((s) => s.openPanel);

  useEffect(() => {
    getDailyVerse().then((result) => {
      if (result) {
        setDailyVerse({
          text: result.text,
          bookName: result.ref.bookName,
          chapter: result.ref.chapter,
          verse: result.ref.verse,
        });
      }
    });
  }, []);

  return (
    <>
      <section aria-labelledby="verse-heading">
        <h2 id="verse-heading" className="text-lg font-semibold text-muted mb-3">
          Versículo del día
        </h2>
        <DailyVerse data={dailyVerse} />
      </section>

      <section aria-label="Acciones principales" className="flex flex-col gap-4">
        <Link href="/leer" className="block">
          <LargeButton variant="primary" size="xl" fullWidth>
            <span aria-hidden="true">📖</span>
            Leer la Biblia
          </LargeButton>
        </Link>
        <LargeButton
          variant="secondary"
          size="xl"
          fullWidth
          onClick={openCompanion}
          aria-label="Abrir compañero de IA para conversar sobre la Biblia"
        >
          <span aria-hidden="true">🎤</span>
          Hablar con el Compañero
        </LargeButton>
      </section>
    </>
  );
}
