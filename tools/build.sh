#!/bin/sh
# Reconstruit le site à partir de src/ : bundle d'origine + Mode Combat amélioré.
set -e
cd "$(dirname "$0")/.."
rm -f assets/*.js
python3 tools/patch.py src/original
python3 tools/patch_combat.py
npx --yes esbuild@0.28.2 src/combat-plus.jsx --bundle --format=esm --minify --target=es2020 \
  --jsx-factory=h --jsx-fragment=Frag --loader:.css=text --outfile=assets/combat-plus-c2.js
echo build ok
