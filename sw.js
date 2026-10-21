// Généré au build — ne pas modifier à la main.
const V = 'clr-77201bd28f';
const B = '/combat-le-rhume/';
const CORE = ["/combat-le-rhume/","/combat-le-rhume/assets/Plantes-CqCOk_87.js","/combat-le-rhume/assets/Recettes-DasA75fA.js","/combat-le-rhume/assets/References-g-dXRHkN.js","/combat-le-rhume/assets/Suivi-C-Yq8Oqx.js","/combat-le-rhume/assets/Symptomes-BeQ_Bwss.js","/combat-le-rhume/assets/fraunces-italic-latin-2HzHoaBL.woff2","/combat-le-rhume/assets/fraunces-italic-latin-ext-LzySCvBX.woff2","/combat-le-rhume/assets/fraunces-normal-latin-COa6imdZ.woff2","/combat-le-rhume/assets/fraunces-normal-latin-ext-BctPH1sx.woff2","/combat-le-rhume/assets/index-DN_r7LZv.css","/combat-le-rhume/assets/index-DpEYP-fj.js","/combat-le-rhume/assets/outfit-normal-latin-Bc-8i84L.woff2","/combat-le-rhume/assets/outfit-normal-latin-ext-DdQaqQDo.woff2","/combat-le-rhume/assets/ui-ChfHGmpY.js","/combat-le-rhume/favicon.svg","/combat-le-rhume/icons/apple-touch-icon.png","/combat-le-rhume/icons/icon-192.png","/combat-le-rhume/icons/icon-512.png","/combat-le-rhume/icons/icon-maskable-192.png","/combat-le-rhume/icons/icon-maskable-512.png","/combat-le-rhume/manifest.webmanifest"];
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
