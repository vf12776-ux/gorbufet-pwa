const CACHE = 'alko-v4'; // меняйте версию при каждом важном апдейте
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon34-192.png',
  '/icon34-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS))
  );
  // Принудительно активируем новый воркер сразу, не дожидаясь закрытия вкладок
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE).map(key => caches.delete(key))
    ))
  );
  // Захватываем все открытые страницы под новый воркер
  clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});