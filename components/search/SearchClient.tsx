"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { searchBible } from "@/lib/bible";
import { useSettingsStore } from "@/lib/stores/settingsStore";
import { useReaderStore } from "@/lib/stores/readerStore";

interface SearchResult {
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const { translation } = useSettingsStore();
  const navigateTo = useReaderStore((s) => s.navigateTo);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (value: string) => {
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.trim().length < 3) {
      setResults([]);
      setSearched(false);
      return;
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setSearched(true);
      const found = await searchBible(translation, value);
      setResults(found);
      setIsSearching(false);
    }, 400);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <label htmlFor="search-input" className="sr-only">
          Buscar en la Biblia
        </label>
        <span
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-xl"
          aria-hidden="true"
        >
          🔍
        </span>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Buscar versículos..."
          autoFocus
          className="w-full min-h-[64px] pl-12 pr-5 rounded-2xl border border-app bg-card text-app text-xl placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
        />
      </div>

      {isSearching && (
        <p className="text-muted text-center text-lg animate-pulse">Buscando...</p>
      )}

      {!isSearching && searched && results.length === 0 && (
        <p className="text-muted text-center text-lg py-8">
          No se encontraron versículos con &ldquo;{query}&rdquo;
        </p>
      )}

      {!isSearching && results.length > 0 && (
        <p className="text-muted text-sm">{results.length} resultado{results.length !== 1 ? "s" : ""}</p>
      )}

      <ul className="flex flex-col gap-3">
        {results.map((r, idx) => (
          <li key={idx}>
            <Link
              href="/leer"
              onClick={() => navigateTo(r.bookId, r.bookName, r.chapter, 999)}
              className="block bg-card border border-app rounded-2xl p-4 active:opacity-70"
            >
              <p className="text-accent font-bold text-base mb-2">
                {r.bookName} {r.chapter}:{r.verse}
              </p>
              <p className="text-app text-lg leading-relaxed line-clamp-3">{r.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
