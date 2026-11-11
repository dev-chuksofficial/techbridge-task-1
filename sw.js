/* TechBridge service worker: network first, falls back to the saved copy when offline. */
var CACHE = 'techbridge-v5';
var FILES = ['./', 'index.html', 'apply.html', 'community.html', 'contact.html', 'programs.html', 'tasks.html', 'tracker.html', 'register.html', 'submit.html', 'dashboard.html', 'portal.html', 'portal.js', 'style.css', 'script.js', 'data.js', 'manifest.webmanifest', 'techbridge-info-sheet.pdf', 'images/logo.png', 'images/logo-white.png', 'images/favicon.png', 'images/bridge.svg', 'images/icon-192.png', 'images/icon-512.png'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res;
  }).catch(function () {
    return caches.match(r).then(function (m) { return m || (r.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});
