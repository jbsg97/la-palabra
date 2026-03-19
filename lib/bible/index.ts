import type { BibleBook, BibleChapter, BibleVerse, BookMeta, Translation } from "./types";

// Cache
const indexCache: Record<string, BookMeta[]> = {};
const bookCache: Record<string, BibleBook> = {};

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar: ${url} (${res.status})`);
  return res.json();
}

export async function getBookIndex(translation: Translation): Promise<BookMeta[]> {
  if (indexCache[translation]) return indexCache[translation];
  const data = await fetchJSON<{ books: BookMeta[] }>(`/data/${translation}/index.json`);
  indexCache[translation] = data.books;
  return data.books;
}

export async function getBook(translation: Translation, bookId: string): Promise<BibleBook> {
  const key = `${translation}/${bookId}`;
  if (bookCache[key]) return bookCache[key];
  const book = await fetchJSON<BibleBook>(`/data/${translation}/books/${bookId}.json`);
  bookCache[key] = book;
  return book;
}

export async function getChapter(
  translation: Translation,
  bookId: string,
  chapterNumber: number
): Promise<BibleChapter | null> {
  const book = await getBook(translation, bookId);
  return book.chapters.find((c) => c.chapter === chapterNumber) ?? null;
}

export async function getVerse(
  translation: Translation,
  bookId: string,
  chapterNumber: number,
  verseNumber: number
): Promise<BibleVerse | null> {
  const chapter = await getChapter(translation, bookId, chapterNumber);
  return chapter?.verses.find((v) => v.verse === verseNumber) ?? null;
}

// Curated list of popular verses for daily verse
const POPULAR_VERSES = [
  { bookId: "juan", bookName: "Juan", chapter: 3, verse: 16, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 23, verse: 1, translation: "rvr60" as Translation },
  { bookId: "jeremias", bookName: "Jeremías", chapter: 29, verse: 11, translation: "rvr60" as Translation },
  { bookId: "romanos", bookName: "Romanos", chapter: 8, verse: 28, translation: "rvr60" as Translation },
  { bookId: "filipenses", bookName: "Filipenses", chapter: 4, verse: 13, translation: "rvr60" as Translation },
  { bookId: "isaias", bookName: "Isaías", chapter: 40, verse: 31, translation: "rvr60" as Translation },
  { bookId: "proverbios", bookName: "Proverbios", chapter: 3, verse: 5, translation: "rvr60" as Translation },
  { bookId: "mateo", bookName: "Mateo", chapter: 11, verse: 28, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 46, verse: 1, translation: "rvr60" as Translation },
  { bookId: "efesios", bookName: "Efesios", chapter: 2, verse: 8, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 14, verse: 6, translation: "rvr60" as Translation },
  { bookId: "romanos", bookName: "Romanos", chapter: 12, verse: 2, translation: "rvr60" as Translation },
  { bookId: "hebreos", bookName: "Hebreos", chapter: 11, verse: 1, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 119, verse: 105, translation: "rvr60" as Translation },
  { bookId: "1corintios", bookName: "1 Corintios", chapter: 13, verse: 4, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 15, verse: 5, translation: "rvr60" as Translation },
  { bookId: "isaias", bookName: "Isaías", chapter: 41, verse: 10, translation: "rvr60" as Translation },
  { bookId: "proverbios", bookName: "Proverbios", chapter: 18, verse: 10, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 27, verse: 1, translation: "rvr60" as Translation },
  { bookId: "mateo", bookName: "Mateo", chapter: 6, verse: 33, translation: "rvr60" as Translation },
  { bookId: "filipenses", bookName: "Filipenses", chapter: 4, verse: 6, translation: "rvr60" as Translation },
  { bookId: "santiago", bookName: "Santiago", chapter: 1, verse: 17, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 37, verse: 4, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 16, verse: 33, translation: "rvr60" as Translation },
  { bookId: "romanos", bookName: "Romanos", chapter: 15, verse: 13, translation: "rvr60" as Translation },
  { bookId: "1pedro", bookName: "1 Pedro", chapter: 5, verse: 7, translation: "rvr60" as Translation },
  { bookId: "efesios", bookName: "Efesios", chapter: 6, verse: 10, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 91, verse: 1, translation: "rvr60" as Translation },
  { bookId: "josue", bookName: "Josué", chapter: 1, verse: 9, translation: "rvr60" as Translation },
  { bookId: "2corintios", bookName: "2 Corintios", chapter: 5, verse: 17, translation: "rvr60" as Translation },
  { bookId: "mateo", bookName: "Mateo", chapter: 5, verse: 9, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 34, verse: 8, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 1, verse: 1, translation: "rvr60" as Translation },
  { bookId: "romanos", bookName: "Romanos", chapter: 10, verse: 9, translation: "rvr60" as Translation },
  { bookId: "proverbios", bookName: "Proverbios", chapter: 31, verse: 30, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 103, verse: 1, translation: "rvr60" as Translation },
  { bookId: "hebreos", bookName: "Hebreos", chapter: 12, verse: 1, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 10, verse: 10, translation: "rvr60" as Translation },
  { bookId: "isaias", bookName: "Isaías", chapter: 53, verse: 5, translation: "rvr60" as Translation },
  { bookId: "1corintios", bookName: "1 Corintios", chapter: 10, verse: 13, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 1, verse: 1, translation: "rvr60" as Translation },
  { bookId: "galatas", bookName: "Gálatas", chapter: 5, verse: 22, translation: "rvr60" as Translation },
  { bookId: "mateo", bookName: "Mateo", chapter: 28, verse: 19, translation: "rvr60" as Translation },
  { bookId: "romanos", bookName: "Romanos", chapter: 5, verse: 8, translation: "rvr60" as Translation },
  { bookId: "apocalipsis", bookName: "Apocalipsis", chapter: 21, verse: 4, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 139, verse: 14, translation: "rvr60" as Translation },
  { bookId: "filipenses", bookName: "Filipenses", chapter: 2, verse: 3, translation: "rvr60" as Translation },
  { bookId: "juan", bookName: "Juan", chapter: 8, verse: 32, translation: "rvr60" as Translation },
  { bookId: "2timoteo", bookName: "2 Timoteo", chapter: 3, verse: 16, translation: "rvr60" as Translation },
  { bookId: "salmos", bookName: "Salmos", chapter: 56, verse: 3, translation: "rvr60" as Translation },
  { bookId: "lucas", bookName: "Lucas", chapter: 1, verse: 37, translation: "rvr60" as Translation },
  { bookId: "efesios", bookName: "Efesios", chapter: 3, verse: 20, translation: "rvr60" as Translation },
];

export async function getDailyVerse(): Promise<{
  ref: (typeof POPULAR_VERSES)[0];
  text: string;
} | null> {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const idx = dayOfYear % POPULAR_VERSES.length;
  const ref = POPULAR_VERSES[idx];

  try {
    const verse = await getVerse(ref.translation, ref.bookId, ref.chapter, ref.verse);
    if (!verse) return null;
    return { ref, text: verse.text };
  } catch {
    return null;
  }
}

export async function searchBible(
  translation: Translation,
  query: string
): Promise<
  Array<{ bookId: string; bookName: string; chapter: number; verse: number; text: string }>
> {
  if (!query.trim() || query.length < 3) return [];

  const books = await getBookIndex(translation);
  const normalized = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  const results: Array<{
    bookId: string;
    bookName: string;
    chapter: number;
    verse: number;
    text: string;
  }> = [];

  for (const bookMeta of books) {
    try {
      const book = await getBook(translation, bookMeta.id);
      for (const chapter of book.chapters) {
        for (const verse of chapter.verses) {
          const normalizedText = verse.text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
          if (normalizedText.includes(normalized)) {
            results.push({
              bookId: bookMeta.id,
              bookName: bookMeta.name,
              chapter: chapter.chapter,
              verse: verse.verse,
              text: verse.text,
            });
            if (results.length >= 50) return results;
          }
        }
      }
    } catch {
      // Skip books not yet downloaded
    }
  }

  return results;
}
