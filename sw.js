const CACHE_NAME = 'pwa-test-v2';
const urlsToCache = [
    'index.html',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// Instalación del Service Worker y almacenamiento en caché
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos en caché actualizados');
                return cache.addAll(urlsToCache);
            })
    );
});

// Activar el Service Worker y limpiar cachés antiguas
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Eliminando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Interceptar solicitudes y servir contenido desde la caché
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});