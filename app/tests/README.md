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
node tests/clr-offline.cjs                                                                  # Hors ligne complet (serveur local intégré, max-age=600 comme GitHub Pages) : 1re visite puis tout hors ligne sur iPhone 13 et Android (sections, Références, polices, icônes, Combat + kit, Enfant, état enregistré, lien externe → « Pas de connexion », repli, 0 requête en échec) + mise à jour « Nouvelle version » (89 vérifications)
node tests/clr-astragale.cjs   http://localhost:4173/combat-le-rhume/                     # Astragale : fiche adulte (dose Santé Canada 2 à 4,8 g + proposition pratique, Sécurité 7 points), cachée en Enfant, Kit Combat (16), prévention Soutien, Références « Astragale » (6 X + 18 études, drapeaux, traductions, étiquettes), nouveaux totaux, ni absinthe ni sarsepareille (99 vérifications)
node tests/clr-vitb-k2.cjs     http://localhost:4173/combat-le-rhume/                     # Vitamines B (fiche adulte, B12/folate/B6, Sécurité 9 points, cachée en Enfant) + K2 sur Vitamines C et D (adulte, Sécurité K2 6 points), Kit Combat (18), prévention Soutien, Références « Vitamines B » + « Vitamine D et K2 », Florence Comite MD, nouveaux totaux (127 vérifications)
node tests/clr-nmn.cjs         http://localhost:4173/combat-le-rhume/                     # NMN (fiche Soutien adulte, 250–500 mg/jour, Sécurité Santé Canada 6 points, cachée en Enfant), Kit Combat (19), prévention Soutien, Références « NMN » (5 publications X, 11 études), nouveaux totaux 187/279/130 (82 vérifications) ; captures dans combat-le-rhume-shots/nmn/
node tests/clr-creatine.cjs     http://localhost:4173/combat-le-rhume/                     # Créatine (fiche Soutien adulte après NMN, 3 à 5 g/jour monohydrate, Sécurité Santé Canada 6 points, cachée en Enfant), pas de kit ni de prévention, Références « Créatine » (4 publications X, 11 études), nouveaux totaux 191/290/138 (79 vérifications) ; captures dans combat-le-rhume-shots/creatine/
```

`SHOTS=/chemin/prefixe_` change l’emplacement des captures.
