
const cacheName = 'todo-app-v1';
const assets = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('js/sw.js').then(registration => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }).catch(error => {
    console.log('ServiceWorker registration failed: ', error);
    });
    }
