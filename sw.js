// ─── LawnPro Service Worker ────────────────────────────────────────────────
// Handles offline caching, background sync, and push notifications

const CACHE_NAME = "lawnpro-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/privacy.html",
  "/terms.html",
  "/affiliate.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
];

// ── Install: cache static assets ──────────────────────────────────────────
self.addEventListener("install", (event) => {
  console.log("[SW] Installing LawnPro service worker");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Some assets failed to cache:", err);
      });
    })
  );
  self.skipWaiting();
});

// ── Activate: clean up old caches ─────────────────────────────────────────
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating LawnPro service worker");
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log("[SW] Deleting old cache:", name);
            return caches.delete(name);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: network-first for API calls, cache-first for static ────────────
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests
  if (event.request.method !== "GET") return;

  // Skip API calls — always go to network for fresh data
  if (
    url.hostname.includes("anthropic.com") ||
    url.hostname.includes("supabase.co") ||
    url.hostname.includes("stripe.com") ||
    url.hostname.includes("openweathermap.org") ||
    url.hostname.includes("plausible.io")
  ) {
    return; // Let browser handle normally
  }

  // Cache-first strategy for static assets (fonts, icons, HTML)
  if (
    url.hostname.includes("fonts.googleapis.com") ||
    url.hostname.includes("fonts.gstatic.com") ||
    event.request.destination === "image" ||
    event.request.destination === "style" ||
    event.request.destination === "script"
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Network-first for HTML pages — fall back to cached version if offline
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Offline fallback page
          return caches.match("/index.html");
        });
      })
  );
});

// ── Push notifications ─────────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};
  const title = data.title || "LawnPro 🌿";
  const options = {
    body: data.body || "Time to check on your lawn!",
    icon: "/icon-192.png",
    badge: "/icon-72.png",
    tag: data.tag || "lawnpro-reminder",
    renotify: true,
    data: { url: data.url || "/" },
    actions: [
      { action: "open", title: "Open LawnPro" },
      { action: "dismiss", title: "Dismiss" },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// ── Notification click handler ─────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;
  const url = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// ── Background sync (for offline report saves) ────────────────────────────
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-reports") {
    console.log("[SW] Background sync: syncing pending reports");
    // Reports are synced next time the app opens with connection
  }
});
