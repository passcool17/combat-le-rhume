# Combat le rhume

Guide pratique pour le rhume et la grippe : protocole, plantes, préparations et suivi des symptômes.

En ligne : https://passcool17.github.io/combat-le-rhume/

Copie de l'appli Grok Build « Remèdes Naturels », renommée « Combat le rhume », publiée sur GitHub Pages
et installable sur téléphone (PWA, fonctionne hors ligne).

- `index.html` + `assets/` : l'appli (bundle client d'origine, chemins adaptés à `/combat-le-rhume/`).
- `manifest.webmanifest`, `sw.js`, `icons/` : installation et mode hors ligne.
- `tools/patch.py` : script qui a produit la copie à partir des fichiers d'origine.

Les données (journal, favoris, préférences) restent dans le téléphone (localStorage).

## Mode Combat amélioré

Le code du Mode Combat (protocole de 3 jours, gestes du jour, suivi matin et soir, « Quand arrêter et consulter »,
précautions, Kit Combat) est dans `src/combat-plus.jsx` et `src/combat-plus.css`, en code lisible.

- `src/original/` : les fichiers d'origine de l'appli Grok Build (référence ; la page est en `index.orig.html.txt` pour ne pas être publiée).
- `tools/build.sh` : reconstruit `index.html` et `assets/` (renomme le bundle, branche le Mode Combat, compile avec esbuild).
- Données du Mode Combat : `localStorage` clé `combat-le-rhume-combat-v1`.

Après une modification : `./tools/build.sh`, puis augmenter `V` dans `sw.js` et `tools/patch_combat.py` si les noms de fichiers changent.

## Mode Combat concentré

En Mode Combat, l'appli ne montre que ce qui concerne le protocole du mal de gorge : onglets Accueil et Remèdes seulement,
accueil et Conseils réduits au Combat, et un bloc « Changer de mode » (Mode Soutien ou « Voir tous les remèdes »).
Le Mode Soutien et la vue sans mode ne changent pas.
