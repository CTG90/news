// Offline support: app shell cached; news.json always tries the network first.
const CACHE = 'news-v3';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  if (url.pathname.endsWith('news.json')) return; // page handles its own offline cache
  e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request)));
});

// Breaking-news alerts.
self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data.json(); } catch { d = { title: 'Breaking news', body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Breaking news', { body: d.body, tag: d.tag, data: { url: d.url }, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png' }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data && e.notification.data.url;
  e.waitUntil(clients.openWindow(url || './'));
});
