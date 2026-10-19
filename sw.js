// Combat le rhume — service worker (offline)
const V = 'clr-v1';
const B = '/combat-le-rhume/';
const CORE = [B, B + 'index.html', B + 'manifest.webmanifest', B + 'favicon.svg',
  B + 'assets/index-DQN6feKR.js', B + 'assets/routes-BZb6ezsO.js', B + 'assets/styles-C6UDtCL4.css',
  B + 'icons/icon-192.png', B + 'icons/icon-512.png', B + 'icons/apple-touch-icon.png'];
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
  if (r.mode === 'navigate' && u.origin === location.origin && u.pathname.startsWith(B)) {
    // network first, fall back to cached app shell
    e.respondWith(fetch(r).then(res => {
      if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(B, cp)); }
      return res;
    }).catch(() => caches.match(B)));
    return;
  }
  const font = u.hostname === 'fonts.googleapis.com' || u.hostname === 'fonts.gstatic.com';
  if ((u.origin === location.origin && u.pathname.startsWith(B)) || font) {
    // stale-while-revalidate
    e.respondWith(caches.open(V).then(c => c.match(r).then(hit => {
      const net = fetch(r).then(res => { if (res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
  }
});
