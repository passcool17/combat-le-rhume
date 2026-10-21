// Généré au build — ne pas modifier à la main.
// Hors ligne complet : tout le build est pré-caché à l’installation ; l’appli s’ouvre depuis le cache, même sans réseau.
const V = 'clr-199261488a';
const B = '/combat-le-rhume/';
const CORE = ["/combat-le-rhume/","/combat-le-rhume/assets/Plantes-D854aiGZ.js","/combat-le-rhume/assets/Recettes-DasA75fA.js","/combat-le-rhume/assets/References-DP-UWxQC.js","/combat-le-rhume/assets/Suivi-BEmw5nJa.js","/combat-le-rhume/assets/Symptomes-BeQ_Bwss.js","/combat-le-rhume/assets/fraunces-italic-latin-2HzHoaBL.woff2","/combat-le-rhume/assets/fraunces-italic-latin-ext-LzySCvBX.woff2","/combat-le-rhume/assets/fraunces-normal-latin-COa6imdZ.woff2","/combat-le-rhume/assets/fraunces-normal-latin-ext-BctPH1sx.woff2","/combat-le-rhume/assets/index-BqcZU-d_.css","/combat-le-rhume/assets/index-CH5HJbvt.js","/combat-le-rhume/assets/outfit-normal-latin-Bc-8i84L.woff2","/combat-le-rhume/assets/outfit-normal-latin-ext-DdQaqQDo.woff2","/combat-le-rhume/assets/ui-ChfHGmpY.js","/combat-le-rhume/favicon.svg","/combat-le-rhume/icons/apple-touch-icon.png","/combat-le-rhume/icons/icon-192.png","/combat-le-rhume/icons/icon-512.png","/combat-le-rhume/icons/icon-maskable-192.png","/combat-le-rhume/icons/icon-maskable-512.png","/combat-le-rhume/manifest.webmanifest","/combat-le-rhume/og.jpg"];
const OFFLINE = '<!doctype html><html lang="fr-CA"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hors ligne · Combat le rhume et la grippe</title><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:3rem auto;padding:0 1.25rem;color:#1d2b24;background:#f7f4ec;line-height:1.5"><h1 style="font-size:1.4rem">Pas de connexion</h1><p>L’appli n’a pas encore été enregistrée sur cet appareil. Ouvre-la une fois avec une connexion : ensuite, elle fonctionnera hors ligne.</p><p><a href="' + B + '" style="color:#1b6b48;font-weight:600">Réessayer</a></p></body></html>';
self.addEventListener('install', e => {
  // cache: 'reload' : on contourne le cache HTTP pour ne jamais pré-cacher une ancienne version d’un fichier.
  e.waitUntil(caches.open(V).then(c => c.addAll(CORE.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('clr-') && k !== V).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'clr-etat') {
    e.waitUntil(caches.open(V).then(c => Promise.all(CORE.map(u => c.match(u)))).then(rs => {
      const n = rs.filter(Boolean).length;
      e.source && e.source.postMessage({ type: 'clr-etat', version: V, total: CORE.length, caches: n, pret: n === CORE.length });
    }));
  }
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || !u.pathname.startsWith(B)) return;
  if (r.mode === 'navigate') {
    // Navigation : l’appli (une seule page) depuis le cache de cette version ; le réseau seulement si elle manque.
    e.respondWith(caches.open(V).then(c => c.match(B)).then(hit => hit || fetch(r).then(res => {
      if (res.ok && u.pathname === B) { const cp = res.clone(); caches.open(V).then(c => c.put(B, cp)); }
      return res;
    })).catch(() => new Response(OFFLINE, { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } })));
    return;
  }
  e.respondWith(caches.match(r, { ignoreSearch: true }).then(hit => hit || fetch(r).then(res => {
    if (res.ok && res.type === 'basic') { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  })));
});
