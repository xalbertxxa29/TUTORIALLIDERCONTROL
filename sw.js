const CACHE_NAME = 'lidercontrol-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './videos.html',
    './manual.html',
    './style.css',
    './script.js',
    './assets/pdf/manual.pdf'
    // Videos will be cached dynamically as they are requested to avoid initial massive download
];

// Install Event: Cache core static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// Activate Event: Cleanup old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Event: Cache First Strategy for "Agile" performance
self.addEventListener('fetch', (event) => {
    // We handle video ranges specially if needed, but for simple "agility":
    // standard Cache-First is good.

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache Hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                // Determine if we should cache this request
                                // Cache videos aggressively as requested
                                const url = event.request.url;
                                if (url.endsWith('.mp4') || url.endsWith('.pdf')) {
                                    cache.put(event.request, responseToCache);
                                }
                            });

                        return response;
                    }
                );
            })
    );
});
