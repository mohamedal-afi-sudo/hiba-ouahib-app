const CACHE_NAME = "hiba-ouahib-tracker-v1";
const APP_ASSETS = [
  "./",
  "./indix.html",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.svg",
  "./icon-512.svg",
  "./pic hb/WhatsApp Image 2026-04-03 at 10.10.00 (1).jpeg",
  "./pic hb/WhatsApp Image 2026-04-03 at 10.10.00.jpeg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const clonedResponse = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clonedResponse));
          return networkResponse;
        })
        .catch(() => caches.match("./indix.html"));
    })
  );
});
