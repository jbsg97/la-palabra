"use client";

import { useEffect, useState, useCallback } from "react";
import { TopBar } from "@/components/layout/TopBar";
import { BookSelector } from "./BookSelector";
import { ChapterSelector } from "./ChapterSelector";
import { VerseDisplay } from "./VerseDisplay";
import { LargeButton } from "@/components/ui/LargeButton";
import { CompanionPanel } from "@/components/companion/CompanionPanel";
import { useReaderStore } from "@/lib/stores/readerStore";
import { useCompanionStore } from "@/lib/stores/companionStore";
import { useBookmarkStore } from "@/lib/stores/bookmarkStore";
import { getChapter } from "@/lib/bible";
import { useTTS } from "@/hooks/useTTS";
import type { BibleChapter } from "@/lib/bible/types";

export function ReaderClient() {
  const { translation, bookId, bookName, chapterNumber, totalChapters,
    isLoading, setLoading, navigateTo, nextChapter, prevChapter } = useReaderStore();
  const { openPanel } = useCompanionStore();
  const bookmarks = useBookmarkStore();
  const tts = useTTS();

  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [chapter, setChapter] = useState<BibleChapter | null>(null);

  const loadChapter = useCallback(async () => {
    setLoading(true);
    tts.cancel();
    try {
      const ch = await getChapter(translation, bookId, chapterNumber);
      setChapter(ch);
    } catch {
      setChapter(null);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translation, bookId, chapterNumber]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  const chapterText = chapter?.verses.map((v) => v.text).join(" ") ?? "";
  const title = `${bookName} ${chapterNumber}`;
  const isBookmarked = bookmarks.isBookmarked(bookId, chapterNumber, 1);

  const toggleBookmark = () => {
    if (!chapter?.verses.length) return;
    if (isBookmarked) {
      const bm = bookmarks.bookmarks.find(
        (b) => b.bookId === bookId && b.chapter === chapterNumber && b.verse === 1
      );
      if (bm) bookmarks.removeBookmark(bm.id);
    } else {
      bookmarks.addBookmark({
        translation,
        bookId,
        bookName,
        chapter: chapterNumber,
        verse: 1,
        text: chapter.verses[0].text,
      });
    }
  };

  const topBarActions = (
    <button
      onClick={toggleBookmark}
      aria-label={isBookmarked ? "Quitar marcador" : "Guardar marcador"}
      className="min-h-[48px] min-w-[48px] flex items-center justify-center text-2xl rounded-xl active:opacity-70"
    >
      {isBookmarked ? "🔖" : "🏷️"}
    </button>
  );

  return (
    <>
      <TopBar title={title} actions={topBarActions} />

      {/* Selector bar */}
      <div className="flex gap-3 px-4 py-3 border-b border-app max-w-2xl mx-auto w-full">
        <button
          onClick={() => setShowBookSelector(true)}
          className="flex-1 min-h-[56px] bg-secondary rounded-2xl px-4 text-app font-semibold text-lg flex items-center justify-between active:opacity-70"
          aria-label={`Libro: ${bookName}. Toca para cambiar`}
        >
          <span>{bookName}</span>
          <span className="text-muted text-base" aria-hidden="true">▼</span>
        </button>
        <button
          onClick={() => setShowChapterSelector(true)}
          className="min-h-[56px] min-w-[90px] bg-secondary rounded-2xl px-4 text-app font-semibold text-lg flex items-center justify-between gap-2 active:opacity-70"
          aria-label={`Capítulo ${chapterNumber}. Toca para cambiar`}
        >
          <span>Cap. {chapterNumber}</span>
          <span className="text-muted text-base" aria-hidden="true">▼</span>
        </button>
      </div>

      {/* Verse content */}
      <div className="max-w-2xl mx-auto w-full px-5 py-6">
        <VerseDisplay chapter={chapter} isLoading={isLoading} />
      </div>

      {/* Action buttons */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-6 flex flex-col gap-3">
        {chapter && (
          <LargeButton
            variant="secondary"
            size="md"
            fullWidth
            onClick={() => (tts.isSpeaking ? tts.cancel() : tts.speak(chapterText))}
            aria-label={tts.isSpeaking ? "Detener lectura en voz alta" : "Leer capítulo en voz alta"}
          >
            <span aria-hidden="true">{tts.isSpeaking ? "⏹" : "▶"}</span>
            {tts.isSpeaking ? "Detener lectura" : "Leer en voz alta"}
          </LargeButton>
        )}
        <LargeButton
          variant="primary"
          size="lg"
          fullWidth
          onClick={openPanel}
          aria-label="Abrir compañero de IA para hacer preguntas sobre este capítulo"
        >
          <span aria-hidden="true">🎤</span>
          Preguntar al Compañero
        </LargeButton>

        {/* Prev / Next chapter */}
        <div className="flex gap-3 mt-2">
          <LargeButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={prevChapter}
            disabled={chapterNumber <= 1}
            aria-label="Capítulo anterior"
          >
            ← Anterior
          </LargeButton>
          <LargeButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={nextChapter}
            disabled={chapterNumber >= totalChapters}
            aria-label="Capítulo siguiente"
          >
            Siguiente →
          </LargeButton>
        </div>
      </div>

      {showBookSelector && (
        <BookSelector
          translation={translation}
          onClose={() => setShowBookSelector(false)}
        />
      )}

      {showChapterSelector && (
        <ChapterSelector
          totalChapters={totalChapters}
          currentChapter={chapterNumber}
          bookName={bookName}
          onSelect={(ch) => navigateTo(bookId, bookName, ch, totalChapters)}
          onClose={() => setShowChapterSelector(false)}
        />
      )}

      <CompanionPanel />
    </>
  );
}
