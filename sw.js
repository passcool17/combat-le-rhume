// Généré au build — ne pas modifier à la main.
const V = 'clr-6ec73747e5';
const B = '/combat-le-rhume/';
const CORE = ["/combat-le-rhume/","/combat-le-rhume/assets/Plantes-CeUK4mHU.js","/combat-le-rhume/assets/Recettes-CVGEDhM9.js","/combat-le-rhume/assets/References-DVasIKsQ.js","/combat-le-rhume/assets/Suivi-GY_awTdg.js","/combat-le-rhume/assets/Symptomes-BDgQWLuO.js","/combat-le-rhume/assets/fraunces-italic-latin-2HzHoaBL.woff2","/combat-le-rhume/assets/fraunces-italic-latin-ext-LzySCvBX.woff2","/combat-le-rhume/assets/fraunces-normal-latin-COa6imdZ.woff2","/combat-le-rhume/assets/fraunces-normal-latin-ext-BctPH1sx.woff2","/combat-le-rhume/assets/index-ClboKu_p.css","/combat-le-rhume/assets/index-_8-jjPqK.js","/combat-le-rhume/assets/outfit-normal-latin-Bc-8i84L.woff2","/combat-le-rhume/assets/outfit-normal-latin-ext-DdQaqQDo.woff2","/combat-le-rhume/assets/stockage-ikf5mt70.js","/combat-le-rhume/assets/ui-CcOyEehZ.js","/combat-le-rhume/favicon.svg","/combat-le-rhume/icons/apple-touch-icon.png","/combat-le-rhume/icons/icon-192.png","/combat-le-rhume/icons/icon-512.png","/combat-le-rhume/icons/icon-maskable-192.png","/combat-le-rhume/icons/icon-maskable-512.png","/combat-le-rhume/manifest.webmanifest"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('clr-') && k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || !u.pathname.startsWith(B)) return;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(B, cp)); }
      return res;
    }).catch(() => caches.match(B)));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
    if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  })));
});
