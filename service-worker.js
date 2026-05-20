// Service worker for the Australian Fixed Income tutorial PWA.
// Strategy: cache-first for the app shell + external CDN assets, with a
// background refresh so updates land on the next visit.

const CACHE_VERSION = 'ausfi-v2';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png'
];

// External resources we want cached after the first online visit.
// We don't pre-cache these (they're large and not all needed for every page),
// but the runtime caching strategy below will save them as they're requested.
const RUNTIME_CACHE_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net',
  'polyfill.io'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  const isSameOrigin = url.origin === self.location.origin;
  const isRuntimeHost = RUNTIME_CACHE_HOSTS.some((h) => url.hostname.endsWith(h));

  if (!isSameOrigin && !isRuntimeHost) return; // Let other requests pass through normally

  // Cache-first with background refresh for the app shell + known runtime hosts.
  event.respondWith(
    caches.open(CACHE_VERSION).then(async (cache) => {
      const cached = await cache.match(req);
      const networkFetch = fetch(req).then((resp) => {
        // Only cache successful, basic/CORS responses
        if (resp && (resp.status === 200 || resp.type === 'opaque')) {
          cache.put(req, resp.clone()).catch(() => {});
        }
        return resp;
      }).catch(() => null);

      // Return cached immediately if we have it, otherwise wait for the network
      if (cached) {
        // Fire and forget the refresh
        networkFetch;
        return cached;
      }
      return (await networkFetch) || new Response('Offline and no cached copy.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    })
  );
});

// Message handler so the page can ask the SW to skip waiting on update
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
