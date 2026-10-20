# Tests (Playwright)

Desktop 1280×720 et iPhone 13, sur un build servi localement (`npm run build && npx vite preview` ou un serveur statique) :

```sh
npm i -D playwright axe-core && npx playwright install chromium
SWV='clr-*' node tests/clr-v5-combat.js http://localhost:4173/combat-le-rhume/ local   # Mode Combat (40 vérifications)
node tests/clr-v5-focus.js  http://localhost:4173/combat-le-rhume/ local               # Mode Combat concentré (20)
node tests/clr-v5-new.js    http://localhost:4173/combat-le-rhume/ local               # accueil, Suivi, replis, installation, partage, axe, 44 px, h1, hauteurs
node tests/clr-accueil-refs.cjs http://localhost:4173/combat-le-rhume/                     # Accueil : bloc Références (148 vérifications, 3 modes, clair/sombre)
node tests/clr-sinus-forte.cjs  http://localhost:4173/combat-le-rhume/                     # Recettes : sinus « La plus forte » (60 vérifications)
node tests/clr-oreilles.cjs     http://localhost:4173/combat-le-rhume/                     # Oreilles : mélange 50/50, 5 minutes maximum, prévention (22 vérifications)
node tests/clr-doses.cjs        http://localhost:4173/combat-le-rhume/                     # Doses selon les références : chaque dose, aucune ancienne dose, zinc (Avertissement, caché en Enfant), Sécurité (103 vérifications)
node tests/clr-argent.cjs       http://localhost:4173/combat-le-rhume/                     # Argent colloïdal : gargarisme/nez ~15 ppm, jamais avalé, Sécurité, caché en Enfant, Combat (renfort optionnel + kit), Références ; titre « Combat le rhume et la grippe » (88 vérifications)
```

`SHOTS=/chemin/prefixe_` change l’emplacement des captures.
