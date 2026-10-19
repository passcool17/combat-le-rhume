# Combat le rhume

Guide pratique pour le rhume et la grippe : protocole, plantes, préparations et suivi des symptômes.

En ligne : https://passcool17.github.io/combat-le-rhume/

Copie de l'appli Grok Build « Remèdes Naturels », renommée « Combat le rhume », publiée sur GitHub Pages
et installable sur téléphone (PWA, fonctionne hors ligne). Les données (suivi, favoris, préférences)
restent dans le téléphone (localStorage).

## Code source (`app/`)

Appli Vite + React 19 + Tailwind CSS 4, en code lisible :

- `app/src/data/contenu.js` : tout le contenu (remèdes, plantes, recettes, symptômes, protocole, conseils…).
- `app/src/pages/` : les écrans (Accueil, Symptômes, Remèdes, Plantes, Recettes, Journal, Conseils).
- `app/src/combat/` : le Mode Combat (protocole de 3 jours, suivi matin et soir, « Quand arrêter et consulter », Kit Combat).
- `app/src/lib/stockage.js` : préférences et données locales (localStorage).
- `app/src/fonts/` : polices Fraunces et Outfit hébergées avec l'appli (pas d'appel à Google Fonts).
- `app/vite.config.js` : base `/combat-le-rhume/`, génération du service worker (`sw.js`, cache versionné par empreinte) et préchargement des polices.

## Déploiement : build commité à la racine

GitHub Pages sert la branche `main`, dossier racine (mode « legacy », sans Actions). Le site publié
(`index.html`, `assets/` aux noms hachés, `sw.js`, `manifest.webmanifest`, `icons/`, `404.html`, `.nojekyll`)
est donc le résultat du build, copié à la racine :

```sh
cd app
npm install
npm run dev            # développement local
npm run publish-site   # build + copie de app/dist vers la racine du dépôt
```

Ensuite, commiter les sources **et** les fichiers de la racine. Une fusion dans `main` met le site à jour.
Le cache hors ligne change automatiquement à chaque build (clé `clr-<empreinte>`).

L'ancien pipeline (rustines sur le bundle minifié d'origine : `tools/patch*.py`, `tools/build.sh`, `src/`)
a été remplacé par ces sources ; il reste consultable dans l'historique Git (avant la refonte v4).
