// Copie le build (app/dist) à la racine du dépôt, servie telle quelle par GitHub Pages (branche main, dossier /).
import { cpSync, rmSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
const root = new URL("../../", import.meta.url).pathname;
const dist = new URL("../dist/", import.meta.url).pathname;
for (const p of ["assets", "icons", "index.html", "404.html", "sw.js", "manifest.webmanifest", "favicon.svg", "og.jpg"]) {
  if (existsSync(join(root, p))) rmSync(join(root, p), { recursive: true, force: true });
}
cpSync(dist, root, { recursive: true });
// 404 : revenir à l’appli (une seule page).
writeFileSync(join(root, "404.html"), readFileSync(new URL("./404.html", import.meta.url)));
writeFileSync(join(root, ".nojekyll"), "");
console.log("publié à la racine :", root);
