"use client";

import Link from "next/link";
import { useBookmarkStore } from "@/lib/stores/bookmarkStore";
import { useReaderStore } from "@/lib/stores/readerStore";

export function BookmarksClient() {
  const { bookmarks, removeBookmark } = useBookmarkStore();
  const navigateTo = useReaderStore((s) => s.navigateTo);

  if (bookmarks.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted text-xl mb-2">No hay marcadores guardados</p>
        <p className="text-muted text-lg">
          Mientras lees, toca el ícono 🏷️ para guardar versículos
        </p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {bookmarks.map((bm) => (
        <li key={bm.id} className="bg-card border border-app rounded-2xl p-4">
          <p className="text-accent font-bold text-base mb-2">
            {bm.bookName} {bm.chapter}:{bm.verse}
          </p>
          <p className="text-app text-lg leading-relaxed mb-4 line-clamp-3">{bm.text}</p>
          <div className="flex gap-3">
            <Link
              href="/leer"
              onClick={() => navigateTo(bm.bookId, bm.bookName, bm.chapter, 999)}
              className="flex-1 min-h-[52px] flex items-center justify-center bg-accent text-accent-fg rounded-xl font-semibold text-base active:opacity-70"
            >
              Ir a leer
            </Link>
            <button
              onClick={() => removeBookmark(bm.id)}
              aria-label={`Borrar marcador de ${bm.bookName} ${bm.chapter}:${bm.verse}`}
              className="min-h-[52px] min-w-[52px] flex items-center justify-center text-red-500 bg-secondary rounded-xl text-xl active:opacity-70"
            >
              🗑️
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
