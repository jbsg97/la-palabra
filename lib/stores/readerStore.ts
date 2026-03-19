"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Translation, BibleBook } from "@/lib/bible/types";

interface ReaderState {
  translation: Translation;
  bookId: string;
  bookName: string;
  chapterNumber: number;
  totalChapters: number;
  currentBook: BibleBook | null;
  isLoading: boolean;
  navigateTo: (bookId: string, bookName: string, chapter: number, totalChapters: number) => void;
  setCurrentBook: (book: BibleBook) => void;
  setLoading: (loading: boolean) => void;
  setTotalChapters: (total: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;
}

export const useReaderStore = create<ReaderState>()(
  persist(
    (set, get) => ({
      translation: "rvr60",
      bookId: "juan",
      bookName: "Juan",
      chapterNumber: 1,
      totalChapters: 21,
      currentBook: null,
      isLoading: false,

      navigateTo: (bookId, bookName, chapter, totalChapters) =>
        set({ bookId, bookName, chapterNumber: chapter, totalChapters, currentBook: null }),

      setCurrentBook: (book) => set({ currentBook: book }),

      setLoading: (isLoading) => set({ isLoading }),

      setTotalChapters: (totalChapters) => set({ totalChapters }),

      nextChapter: () => {
        const { chapterNumber, totalChapters } = get();
        if (chapterNumber < totalChapters) {
          set({ chapterNumber: chapterNumber + 1, currentBook: null });
        }
      },

      prevChapter: () => {
        const { chapterNumber } = get();
        if (chapterNumber > 1) {
          set({ chapterNumber: chapterNumber - 1, currentBook: null });
        }
      },
    }),
    {
      name: "la-palabra-reader",
      partialize: (state) => ({
        translation: state.translation,
        bookId: state.bookId,
        bookName: state.bookName,
        chapterNumber: state.chapterNumber,
        totalChapters: state.totalChapters,
      }),
    }
  )
);
