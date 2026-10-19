# Combat le rhume

Guide pratique pour le rhume et la grippe : protocole, plantes, préparations et suivi des symptômes.

En ligne : https://passcool17.github.io/combat-le-rhume/

Copie de l'appli Grok Build « Remèdes Naturels », renommée « Combat le rhume », publiée sur GitHub Pages
et installable sur téléphone (PWA, fonctionne hors ligne). Les données (suivi, favoris, préférences)
restent dans le téléphone (localStorage).

## Fonctions (refonte v4)

- Accueil de première visite : explication en 3 lignes, les deux modes, bouton « Commencer ».
- Onglet **Suivi** toujours accessible (aussi en Mode Combat) : journal du jour + point matin et soir du protocole,
  historique, **Exporter mes données** (JSON et CSV), **Importer** (JSON validé, avec aperçu et confirmation),
  **Tout effacer** (avec confirmation ; les préférences sont gardées).
- Sections repliables et menu « Sur cette page » (accueil du Mode Soutien, Remèdes).
- Bannière « Installer l’appli » (Android : invite du navigateur ; iPhone : instructions), bouton « Partager ».

## Code source (`app/`)

Appli Vite + React 19 + Tailwind CSS 4, en code lisible :

- `app/src/data/contenu.js` : tout le contenu (remèdes, plantes, recettes, symptômes, protocole, conseils…).
- `app/src/pages/` : les écrans (Accueil, Symptômes, Remèdes, Plantes, Recettes, Journal, Conseils).
- `app/src/combat/` : le Mode Combat (protocole de 3 jours, suivi matin et soir, « Quand arrêter et consulter », Kit Combat).
- `app/src/lib/suivi.js` : données du Suivi (une seule clé), migration, validation, export JSON/CSV.
- `app/src/lib/stockage.js` : préférences (localStorage).
- `app/src/lib/nav.js` : onglet courant et navigation.
- `app/src/fonts/` : polices Fraunces et Outfit hébergées avec l'appli (pas d'appel à Google Fonts) ;
  l’axe de graisse de Fraunces est limité aux graisses utilisées (560–650, italique 560) pour alléger les fichiers.
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

## Données locales (localStorage)

| Clé | Contenu |
|---|---|
| `remedes-naturels-prefs-v1` | Adulte/Enfant, mode sombre, favoris, mode choisi, accueil vu, bannière masquée |
| `combat-le-rhume-suivi-v1` | Suivi unifié : `journal`, `checks` (matin/soir), `protocol`, `intakes`, `intervals`, `kit`, `reminders`, `history` |
| `remedes-naturels-journal-v1`, `combat-le-rhume-combat-v1` | Anciennes clés : lues une fois pour la migration, laissées en copie de secours, supprimées par « Tout effacer » |
