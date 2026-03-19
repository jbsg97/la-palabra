"use client";

import { useEffect, useState } from "react";
import { getBookIndex } from "@/lib/bible";
import type { BookMeta, Translation } from "@/lib/bible/types";
import { useReaderStore } from "@/lib/stores/readerStore";

interface BookSelectorProps {
  translation: Translation;
  onClose: () => void;
}

export function BookSelector({ translation, onClose }: BookSelectorProps) {
  const [books, setBooks] = useState<BookMeta[]>([]);
  const navigateTo = useReaderStore((s) => s.navigateTo);

  useEffect(() => {
    getBookIndex(translation).then(setBooks);
  }, [translation]);

  const otBooks = books.filter((b) => b.testament === "OT");
  const ntBooks = books.filter((b) => b.testament === "NT");

  const handleSelect = (book: BookMeta) => {
    navigateTo(book.id, book.name, 1, book.chapters);
    onClose();
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Seleccionar libro"
        className="fixed inset-x-0 bottom-[64px] top-0 z-50 bg-card flex flex-col max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-app shrink-0">
          <h2 className="text-app font-bold text-xl">Seleccionar Libro</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar selector"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center text-muted text-2xl rounded-xl"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <BookSection title="Antiguo Testamento" books={otBooks} onSelect={handleSelect} />
          <BookSection title="Nuevo Testamento" books={ntBooks} onSelect={handleSelect} />
        </div>
      </div>
    </>
  );
}

function BookSection({
  title,
  books,
  onSelect,
}: {
  title: string;
  books: BookMeta[];
  onSelect: (b: BookMeta) => void;
}) {
  return (
    <div>
      <h3 className="text-muted font-semibold text-base px-5 py-3 sticky top-0 bg-card border-b border-app">
        {title}
      </h3>
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <button
              onClick={() => onSelect(book)}
              className="w-full min-h-[56px] flex items-center justify-between px-5 text-app text-lg font-medium border-b border-app active:bg-secondary"
            >
              <span>{book.name}</span>
              <span className="text-muted text-base">{book.chapters} cap.</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
