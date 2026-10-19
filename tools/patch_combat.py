"""Branche le Mode Combat amélioré (src/combat-plus.jsx) dans le bundle d'origine.
À lancer après tools/patch.py (voir tools/build.sh). Les fichiers sont renommés avec V
pour que les anciens caches (service worker, navigateur) ne servent pas l'ancienne version."""
import os, re
V = 'c2'
def rep(s, a, b, n=1):
    c = s.count(a); assert c == n, (a[:80], c); return s.replace(a, b)
IDX, RTS = 'assets/index-DQN6feKR.js', 'assets/routes-BZb6ezsO.js'
NIDX, NRTS, PLUS = f'index-{V}.js', f'routes-{V}.js', f'combat-plus-{V}.js'
s = open(RTS).read()
s = rep(s, 'import{i as e,n as t,r as n,t as r}from"./index-DQN6feKR.js";',
        f'import{{i as e,n as t,r as n,t as r}}from"./{NIDX}";import{{createCombatPlus as __clrF}}from"./{PLUS}";')
s = rep(s, ',W=t();function G(', ',W=t(),__clr=__clrF(v,W,k);function G(')
# sous-titre du Mode Combat (masque « très chaud / tuque » si fièvre, frissons ou mal de tête notés)
s = rep(s, 'children:s===`combat`?`Les quatre gestes, dans l’ordre. La nuit, très chaud, même une tuque — seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons.`:',
        'children:s===`combat`?(0,W.jsx)(__clr.Subtitle,{}):')
# même phrase sur l’accueil
s = rep(s, 'children:`Combattre dès les premiers signes. La nuit, avoir très chaud, même avec une tuque — seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons.`',
        'children:(0,W.jsx)(__clr.HomeWarm,{})')
# panneau (protocole, checklist, consulter, suivi, kit) sous « Logique des remèdes prioritaires »
s = rep(s, 'children:`Objectif : supériorité offensive dès les premiers signes de mal de gorge.`})]}):null,',
        'children:`Objectif : supériorité offensive dès les premiers signes de mal de gorge.`})]}):null,s===`combat`?(0,W.jsx)(__clr.Panel,{audience:o}):null,')
# profil Enfant : pas de peroxyde dans le Mode Combat
s = rep(s, 'return r&&!a||', 'return r&&!a||r&&o===`enfant`&&n.id===`peroxyde`||')
s = rep(s, '},[c,i,e,n,s]);', '},[c,i,e,n,s,o]);')
# précautions sur chaque fiche geste du Mode Combat
s = rep(s, 'children:e.tag})]},e.id))', 'children:e.tag}),s===`combat`?(0,W.jsx)(__clr.GesteExtra,{id:e.id,audience:o}):null]},e.id))')
open('assets/' + NRTS, 'w').write(s); os.remove(RTS)
s = open(IDX).read()
s = rep(s, './routes-BZb6ezsO.js', './' + NRTS)
open('assets/' + NIDX, 'w').write(s); os.remove(IDX)
h = open('index.html').read()
h = rep(h, 'index-DQN6feKR.js', NIDX, 4)
h = rep(h, 'routes-BZb6ezsO.js', NRTS, 2)
h = rep(h, '<link rel="modulepreload" href="/combat-le-rhume/assets/' + NRTS + '"/>',
        '<link rel="modulepreload" href="/combat-le-rhume/assets/' + NRTS + '"/><link rel="modulepreload" href="/combat-le-rhume/assets/' + PLUS + '"/>')
open('index.html', 'w').write(h)
print('combat patched', V)
