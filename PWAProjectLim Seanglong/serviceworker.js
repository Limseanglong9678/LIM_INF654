const CACHE_NAME = 'pet-care-cache-v4';
const ASSETS_TO_CACHE = [
    'start.html',
    'style.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
];

self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Caching assets...', ASSETS_TO_CACHE);
            return cache.addAll(ASSETS_TO_CACHE).catch((error) => {
                console.error('Cache installation failed:', error);
            });
        })
    );
});


self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Deleting old cache:', cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                console.error('Fetch failed for:', event.request.url);
                return new Response('Offline content unavailable.', {
                    status: 503,
                    statusText: 'Service Unavailable',
                });
            });
        })
    );
});


