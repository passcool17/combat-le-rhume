import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { createHash } from "node:crypto";
import { readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const BASE = "/combat-le-rhume/";

function listPublic(dir, root = dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? listPublic(p, root) : [relative(root, p)];
  });
}

/** Service worker hors ligne : liste de pré-cache et version calculées à chaque build. */
function serviceWorker() {
  return {
    name: "clr-service-worker",
    apply: "build",
    generateBundle(_, bundle) {
      const files = [...Object.keys(bundle), ...listPublic("public")].filter((f) => !f.endsWith(".map") && !["og.jpg", "robots.txt", "sitemap.xml"].includes(f));
      const version = createHash("sha256").update(files.sort().join("|")).digest("hex").slice(0, 10);
      const urls = ["", ...files.filter((f) => f !== "index.html")].map((f) => BASE + f);
      const code = `// Généré au build — ne pas modifier à la main.
const V = 'clr-${version}';
const B = '${BASE}';
const CORE = ${JSON.stringify(urls)};
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
