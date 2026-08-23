const CACHE_NAME = "expense-tracker-v5-offline-ux";

const STATIC_ASSETS = [
  "/frontend/",
  "/frontend/dashboard.html",
  "/frontend/index.html",
  "/frontend/login.html",
  "/frontend/offline.html",

  "/frontend/css/style.css",

  "/frontend/js/main.js",
  "/frontend/js/state.js",
  "/frontend/js/ui.js",
  "/frontend/js/events.js",
  "/frontend/js/chart.js",

  "/frontend/manifest.json",
  "/frontend/icons/icon-192.png",
  "/frontend/icons/icon-512.png"
];

// ---------- INSTALL ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ---------- ACTIVATE ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// ---------------- FETCH ----------------
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // 1️⃣ HTML pages
  if (req.destination === "document") {
    event.respondWith(
      caches.match(req).then((cached) => {
        return (
          cached ||
          fetch(req).catch(() =>
            caches.match("/frontend/offline.html")
          )
        );
      })
    );
    return;
  }

  // 2️⃣ JS & CSS (CRITICAL FIX)
  if (
    req.destination === "script" ||
    req.destination === "style"
  ) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;

        return fetch(req).catch(() => {
          // 👇 THIS PREVENTS main.js FAILURE
          return new Response("", {
            status: 200,
            headers: { "Content-Type": "text/javascript" }
          });
        });
      })
    );
    return;
  }

  // 3️⃣ Images / fonts / others
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req))
  );
});


// ================= BACKGROUND SYNC (FUTURE) =================
self.addEventListener("sync", event => {
  if (event.tag === "expense-sync") {
    event.waitUntil(handleBackgroundSync());
  }
});

async function handleBackgroundSync() {
  console.log("🔄 Background sync triggered");

  // Future flow:
  // 1. Read IndexedDB
  // 2. Send to cloud
  // 3. Clear pending_sync

  // For now, just acknowledge sync
  await Promise.resolve();
}

