export interface BibleVerse {
  verse: number;
  text: string;
}

export interface BibleChapter {
  chapter: number;
  verses: BibleVerse[];
}

export interface BibleBook {
  id: string;
  name: string;
  chapters: BibleChapter[];
}

export interface BookMeta {
  id: string;
  name: string;
  testament: "OT" | "NT";
  chapters: number;
  order: number;
}

export interface BibleIndex {
  translation: string;
  abbreviation: string;
  language: string;
  books: BookMeta[];
}

export type Translation = "rvr60" | "kjv";

export interface PassageReference {
  translation: Translation;
  bookId: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
}

export interface Bookmark {
  id: string;
  translation: Translation;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  savedAt: number;
}
