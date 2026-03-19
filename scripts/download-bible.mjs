/**
 * Script para descargar los datos bíblicos de la API getBible v2
 * Uso: node scripts/download-bible.mjs
 *
 * Traducciones:
 *  - Español: "valera" (Reina Valera 1909, dominio público) → guardada en /data/rvr60/
 *  - Inglés:  "kjv" (King James Version) → guardada en /data/kjv/
 *
 * Nota: El RVR60 (1960) tiene copyright y no está disponible en la API pública.
 *       La Reina Valera 1909 es prácticamente idéntica en contenido.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";

const BASE_URL = "https://api.getbible.net/v2";
// On Windows, URL.pathname starts with /C:/ — we strip the leading slash
const rawPath = new URL("../public/data", import.meta.url).pathname;
const DATA_DIR = process.platform === "win32" ? rawPath.replace(/^\/([A-Z]:)/, "$1") : rawPath;

// Map our internal translation IDs to the API's translation codes
const TRANSLATION_MAP = {
  rvr60: "valera",  // Reina Valera 1909 (public domain) stored as rvr60
  kjv: "kjv",
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadBook(apiTranslation, bookNumber, bookId) {
  const url = `${BASE_URL}/${apiTranslation}/${bookNumber}.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // getBible API returns Latin-1 for Reina Valera, UTF-8 for KJV
    const buffer = await res.arrayBuffer();
    let text;
    try {
      text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
    } catch {
      text = new TextDecoder("latin1").decode(buffer);
    }

    const data = JSON.parse(text);

    // Transform getBible v2 format to our format
    const book = {
      id: bookId,
      name: data.name,
      chapters: data.chapters.map((ch) => ({
        chapter: ch.chapter,
        verses: ch.verses.map((v) => ({
          verse: v.verse,
          text: v.text.trim(),
        })),
      })),
    };

    return book;
  } catch (err) {
    console.error(`  ✗ Error descargando ${apiTranslation}/${bookNumber}: ${err.message}`);
    return null;
  }
}

async function downloadTranslation(internalTranslation) {
  const apiTranslation = TRANSLATION_MAP[internalTranslation];
  const indexPath = `${DATA_DIR}/${internalTranslation}/index.json`;

  if (!existsSync(indexPath)) {
    console.error(`No se encontró el índice: ${indexPath}`);
    return;
  }

  const index = JSON.parse(readFileSync(indexPath, "utf-8"));
  const booksDir = `${DATA_DIR}/${internalTranslation}/books`;
  mkdirSync(booksDir, { recursive: true });

  console.log(`\nDescargando ${index.translation} (via API: ${apiTranslation}, ${index.books.length} libros)...`);

  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const bookMeta of index.books) {
    const bookPath = `${booksDir}/${bookMeta.id}.json`;

    if (existsSync(bookPath)) {
      process.stdout.write(`  ↩ ${bookMeta.name} (ya existe)\n`);
      skipped++;
      continue;
    }

    process.stdout.write(`  ↓ ${bookMeta.name}...`);
    const book = await downloadBook(apiTranslation, bookMeta.apiNumber, bookMeta.id);

    if (book) {
      writeFileSync(bookPath, JSON.stringify(book, null, 2), "utf-8");
      process.stdout.write(` ✓\n`);
      downloaded++;
    } else {
      process.stdout.write(` ✗\n`);
      failed++;
    }

    // 200ms between requests to be polite to the API
    await sleep(200);
  }

  console.log(`\n${internalTranslation}: ${downloaded} descargados, ${skipped} omitidos, ${failed} fallidos.`);
}

async function main() {
  console.log("=== Descarga de datos bíblicos (getBible API v2) ===");
  console.log("Directorio de datos:", DATA_DIR);

  await downloadTranslation("rvr60");
  await downloadTranslation("kjv");

  console.log("\n✓ Descarga completa.");
  console.log("\nNota: El texto español es la Reina Valera 1909 (dominio público).");
  console.log("Es prácticamente idéntica a la RVR60 en contenido.");
}

main().catch(console.error);
