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
node tests/clr-doses.cjs        http://localhost:4173/combat-le-rhume/                     # Doses selon les références : chaque dose, aucune ancienne dose, zinc (Avertissement, ligne cuivre, caché en Enfant), Sécurité, quercétine, clou de girofle (113 vérifications)
node tests/clr-argent.cjs       http://localhost:4173/combat-le-rhume/                     # Argent colloïdal : gargarisme/nez ~15 ppm, jamais avalé, Sécurité, caché en Enfant, Combat (renfort optionnel + kit), Références ; titre « Combat le rhume et la grippe » (88 vérifications)
node tests/clr-quercetine.cjs   http://localhost:4173/combat-le-rhume/                     # Quercétine : fiche (dose, avec le zinc, Sécurité), cachée en Enfant, Combat (renfort optionnel + kit), Soutien, prévention, thème Références (77 vérifications)
node tests/clr-girofle.cjs      http://localhost:4173/combat-le-rhume/                     # Clou de girofle : fiche (mâcher, gargarisme, infusion, bain de bouche 1 à 5 %, Sécurité), filtre Gorge, cachée en Enfant, Combat (renfort optionnel + kit, miel seul inchangé), thème Références (75 vérifications)
node tests/clr-nac-echinacee-gingembre.cjs http://localhost:4173/combat-le-rhume/          # NAC (fiche adulte, Sécurité, cachée en Enfant, renfort Combat + kit 15), Échinacée renforcée (tisane gardée, extrait standardisé, prévention, Sécurité), fiche Gingembre (dès 6 ans, Sécurité), miel seul inchangé, Références (groupe NAC, ajouts Échinacée/Gingembre, Sécurité) (148 vérifications)
node tests/clr-international.cjs  http://localhost:4173/combat-le-rhume/                     # Références internationales : 21 publications X (10 langues) + 70 études (19 pays), drapeau + pays + langue, traduction, thèmes existants, filtre « International », totaux accueil/Références (55 vérifications)
```

`SHOTS=/chemin/prefixe_` change l’emplacement des captures.
