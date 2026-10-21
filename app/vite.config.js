import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BASE = "/combat-le-rhume/";

function listPublic(dir, root = dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listPublic(p, root) : [relative(root, p)];
  });
}

/** Service worker hors ligne : liste de pré-cache et version calculées à chaque build (d’après le contenu des fichiers). */
function serviceWorker() {
  return {
    name: "clr-service-worker",
    apply: "build",
    generateBundle(_, bundle) {
      const skip = ["robots.txt", "sitemap.xml"];
      const files = [...Object.keys(bundle), ...listPublic("public")].filter((f) => !f.endsWith(".map") && !skip.includes(f)).sort();
      // Version liée au contenu du build : un changement dans n’importe quel fichier (JS, CSS, HTML, icônes, manifeste…) crée un nouveau cache.
      const h = createHash("sha256");
      for (const f of files) {
        const b = bundle[f];
        h.update(f + "\0").update(b ? (b.type === "chunk" ? b.code : b.source) : readFileSync(join("public", f))).update("\0");
      }
      const version = h.digest("hex").slice(0, 10);
      const urls = ["", ...files.filter((f) => f !== "index.html")].map((f) => BASE + f);
      const code = `// Généré au build — ne pas modifier à la main.
// Hors ligne complet : tout le build est pré-caché à l’installation ; l’appli s’ouvre depuis le cache, même sans réseau.
const V = 'clr-${version}';
const B = '${BASE}';
const CORE = ${JSON.stringify(urls)};
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
`;
      this.emitFile({ type: "asset", fileName: "sw.js", source: code });
    },
  };
}

/** Précharge les deux polices principales (latin) pour un premier affichage plus rapide. */
function preloadFonts() {
  return {
    name: "clr-preload-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const fonts = Object.keys(ctx.bundle || {}).filter((f) => /(outfit-normal-latin|fraunces-normal-latin)-[\w-]+\.woff2$/.test(f) && !f.includes("-latin-ext-"));
        const tags = fonts.map((f) => ({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: BASE + f, crossorigin: "" }, injectTo: "head-prepend" }));
        return { html, tags };
      },
    },
  };
}

export default defineConfig({
  base: BASE,
  plugins: [react(), tailwindcss(), serviceWorker(), preloadFonts()],
  build: { outDir: "dist", assetsInlineLimit: 0, sourcemap: false },
});
