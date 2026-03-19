const CACHE_NAME = "la-palabra-v1";
const BIBLE_CACHE = "la-palabra-bible-v1";

// App shell routes to precache
const APP_SHELL = [
  "/",
  "/leer",
  "/buscar",
  "/marcadores",
  "/offline",
];

// ─── Install ──────────────────────────────────────────────────────────
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME && k !== BIBLE_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ─── Fetch ─────────────────────────────────────────────────────────────
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept API calls
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Bible JSON data: Cache First
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/data/")) {
    event.respondWith(cacheFirst(request, BIBLE_CACHE));
    return;
  }

  // Navigation: App Shell (serve from cache, fallback to offline page)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match("/offline").then((r) => r ?? new Response("Sin conexión", { status: 503 }))
      )
    );
    return;
  }

  // Everything else: Network First with cache fallback
  event.respondWith(networkFirst(request, CACHE_NAME));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached ?? new Response("Sin conexión", { status: 503 });
  }
}
