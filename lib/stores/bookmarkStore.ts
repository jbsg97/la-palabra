"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark } from "@/lib/bible/types";

const MAX_BOOKMARKS = 50;

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (b: Omit<Bookmark, "id" | "savedAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (bookId: string, chapter: number, verse: number) => boolean;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (b) => {
        const { bookmarks } = get();
        if (bookmarks.length >= MAX_BOOKMARKS) return;
        const id = `${b.bookId}-${b.chapter}-${b.verse}-${Date.now()}`;
        set({ bookmarks: [{ ...b, id, savedAt: Date.now() }, ...bookmarks] });
      },

      removeBookmark: (id) =>
        set((state) => ({
          bookmarks: state.bookmarks.filter((bm) => bm.id !== id),
        })),

      isBookmarked: (bookId, chapter, verse) =>
        get().bookmarks.some(
          (bm) => bm.bookId === bookId && bm.chapter === chapter && bm.verse === verse
        ),
    }),
    {
      name: "la-palabra-bookmarks",
    }
  )
);
