# Combat le rhume

Guide pratique pour le rhume et la grippe : protocole, plantes, préparations et suivi des symptômes.

En ligne : https://passcool17.github.io/combat-le-rhume/

Copie de l'appli Grok Build « Remèdes Naturels », renommée « Combat le rhume », publiée sur GitHub Pages
et installable sur téléphone (PWA, fonctionne hors ligne).

- `index.html` + `assets/` : l'appli (bundle client d'origine, chemins adaptés à `/combat-le-rhume/`).
- `manifest.webmanifest`, `sw.js`, `icons/` : installation et mode hors ligne.
- `tools/patch.py` : script qui a produit la copie à partir des fichiers d'origine.

Les données (journal, favoris, préférences) restent dans le téléphone (localStorage).
