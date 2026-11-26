/* TechBridge service worker: network first, falls back to the saved copy when offline. */
var CACHE = 'techbridge-v9';
var FILES = ['./', 'index.html', 'apply.html', 'community.html', 'contact.html', 'programs.html', 'tasks.html', 'tracker.html', 'roadmap.html', 'roadmap.js', 'challenges.html', 'challenges.js', 'dashboard.js', 'portal-dashboard.html', 'register.html', 'submit.html', 'dashboard.html', 'portal.html', 'portal.js', 'style.css', 'script.js', 'data.js', 'manifest.webmanifest', 'techbridge-info-sheet.pdf', 'images/logo.png', 'images/logo-white.png', 'images/favicon.png', 'images/bridge.svg', 'images/icon-192.png', 'images/icon-512.png'];
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
  var u = new URL(r.url);
  /* Task 7: API calls must always go to the network. A cached copy would hide a stopped backend. */
  if (r.method !== 'GET' || u.origin !== location.origin || u.pathname.indexOf('/api/') === 0) return;
  e.respondWith(fetch(r).then(function (res) {
    var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res;
  }).catch(function () {
    return caches.match(r).then(function (m) { return m || (r.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});
