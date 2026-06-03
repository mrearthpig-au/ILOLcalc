// Service Worker - ILOL & Impound Date Calculator
// Caches app files so it works offline after the first load.


// ============================================================
// ===================== Cache Settings =======================
// ============================================================

const CACHE_NAME = 'ilol-calculator-v1';

// Every file the app needs to run offline.
const FILES_TO_CACHE = [
    '/date-calculator/',
    '/date-calculator/ILOL_Calculator.html',
    '/date-calculator/manifest.json',
    '/date-calculator/ILOL.png'
];


// ============================================================
// ===================== Install Event ========================
// ============================================================

// Runs once when the service worker is first installed.
// Downloads and caches everything in the list above.

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    self.skipWaiting();
});


// ============================================================
// ===================== Activate Event =======================
// ============================================================

// Clears out any old caches left over from previous versions.

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(
                keyList.map(function(key) {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});


// ============================================================
// ===================== Fetch Event ==========================
// ============================================================

// Intercepts network requests and serves cached files where possible.
// Falls back to the network if something isn't in the cache.

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
