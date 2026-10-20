# Tests (Playwright)

Desktop 1280×720 et iPhone 13, sur un build servi localement (`npm run build && npx vite preview` ou un serveur statique) :

```sh
npm i -D playwright axe-core && npx playwright install chromium
SWV='clr-*' node tests/clr-v5-combat.js http://localhost:4173/combat-le-rhume/ local   # Mode Combat (40 vérifications)
node tests/clr-v5-focus.js  http://localhost:4173/combat-le-rhume/ local               # Mode Combat concentré (20)
node tests/clr-v5-new.js    http://localhost:4173/combat-le-rhume/ local               # accueil, Suivi, replis, installation, partage, axe, 44 px, h1, hauteurs
node tests/clr-accueil-refs.cjs http://localhost:4173/combat-le-rhume/                     # Accueil : bloc Références (148 vérifications, 3 modes, clair/sombre)
```

`SHOTS=/chemin/prefixe_` change l’emplacement des captures.
