const CACHE_NAME = 'hitech-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/manifest.json',
  '/assets/images/logo-trasp.png',
  '/assets/favicon-16x16.png',
  '/assets/favicon-32x32.png',
  '/assets/apple-touch-icon.png',
  '/assets/android-chrome-192x192.png',
  '/assets/android-chrome-512x512.png',
  '/assets/i18n/it.json',
  '/assets/i18n/en.json'
];

// Install Event - caching assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Pre-caching offline shell');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event - cache first for static assets, network first for others
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Exclude non-GET requests or browser extension/firebase queries
  if (event.request.method !== 'GET' || 
      requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:' ||
      requestUrl.host.includes('firestore') || 
      requestUrl.host.includes('google') ||
      requestUrl.host.includes('identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached asset, but fetch in background to update cache (Stale-While-Revalidate pattern)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
          }
        }).catch(() => {/* Ignore background fetch errors */});
        
        return cachedResponse;
      }

      // Not cached - fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Cache static local assets and font resources dynamically
        if (networkResponse && networkResponse.status === 200 && (
          requestUrl.origin === self.location.origin && requestUrl.pathname.includes('/assets/') ||
          requestUrl.host.includes('fonts.gstatic.com') ||
          requestUrl.host.includes('fonts.googleapis.com')
        )) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch((err) => {
        // Offline Fallback for SPA routing - serve index.html
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/index.html');
        }
        return Promise.reject(err);
      });
    })
  );
});
