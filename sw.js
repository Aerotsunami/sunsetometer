// Service worker: кэш оболочки приложения для оффлайн-установки.
// Погодные ответы НЕ кэшируем — они должны быть свежими.
const CACHE = 'sunsetometer-v23';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // API-запросы к Open-Meteo — всегда сеть, без кэша.
  if (url.hostname.endsWith('open-meteo.com')) {
    e.respondWith(fetch(e.request).catch(() => new Response('{"error":"offline"}', {
      headers: { 'Content-Type': 'application/json' }
    })));
    return;
  }
  // Оболочка — сначала кэш, затем сеть.
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(resp => {
      if (e.request.method === 'GET' && resp.ok && url.origin === location.origin) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return resp;
    }).catch(() => caches.match('./index.html')))
  );
});
