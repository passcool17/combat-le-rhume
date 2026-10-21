// Mode hors ligne complet : 1re visite en ligne, puis TOUT hors ligne (iPhone 13 et Android) : chaque section, Références,
// polices, icônes, manifeste, image de partage, Mode Combat/Soutien + kit, Adulte/Enfant, état enregistré, lien externe
// (message « Pas de connexion »), repli de navigation, 0 requête en échec ; puis scénario de mise à jour (« Nouvelle version »).
// usage : node tests/clr-offline.cjs [url]   (sans url : serveur local intégré sur le build publié à la racine du dépôt,
//         avec Cache-Control: max-age=600 comme GitHub Pages ; le scénario de mise à jour utilise toujours une copie locale)
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');const http=require('http');const os=require('os');
const ROOT=path.resolve(__dirname,'../..');const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const TYPES={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.txt':'text/plain','.xml':'application/xml'};
function serve(dir){return new Promise(res=>{const s=http.createServer((q,r)=>{let u=decodeURIComponent(new URL(q.url,'http://x').pathname);
  if(!u.startsWith('/combat-le-rhume/')){r.writeHead(404);return r.end();}let f=path.join(dir,u.slice('/combat-le-rhume/'.length));
  if(u.endsWith('/'))f=path.join(f,'index.html');if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){f=path.join(dir,'404.html');r.writeHead(404,{'Content-Type':TYPES['.html']});return r.end(fs.readFileSync(f));}
  r.writeHead(200,{'Content-Type':TYPES[path.extname(f)]||'application/octet-stream','Cache-Control':'max-age=600'});r.end(fs.readFileSync(f));});
  s.listen(0,'127.0.0.1',()=>res(s));});}
function copySite(dst){for(const p of ['assets','icons','index.html','404.html','sw.js','manifest.webmanifest','favicon.svg','og.jpg','robots.txt','sitemap.xml'])fs.cpSync(path.join(ROOT,p),path.join(dst,p),{recursive:true});}
// Totaux attendus lus dans refs-meta.js (les mêmes que l’accueil).
const META=fs.readFileSync(path.join(ROOT,'app/src/data/refs-meta.js'),'utf8');const num=k=>+META.match(new RegExp(k+' = (\\d+)'))[1];
const INTLM=JSON.parse(META.match(/INTL_META = (\{.*?\});/)[1]);const NGROUPS=JSON.parse(META.match(/REF_GROUP_META = (\[.*?\]);/)[1]).length;
const STATS=[num('REF_COUNT'),num('MEDECIN_COUNT'),num('ETUDE_COUNT')];
let fail=0,n=0;
(async()=>{const b=await chromium.launch({executablePath:process.env.CHROME||'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 let srv=null,url=process.argv[2];if(!url){srv=await serve(ROOT);url=`http://127.0.0.1:${srv.address().port}/combat-le-rhume/`;}
 const origin=new URL(url).origin;
 for(const [dn,dev] of [['iphone13',devices['iPhone 13']],['android',devices['Pixel 7']]]){
  const ctx=await b.newContext({...dev,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();
  const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
  let offline=false;const failed=[],errs=[];
  ctx.on('requestfailed',r=>{if(offline)failed.push(r.url()+' '+(r.failure()?.errorText||''));});
  p.on('pageerror',e=>errs.push(e.message));
  const clk=async(nm,root=p)=>{const l=root.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(400);return true;}throw new Error('bouton introuvable : '+nm);};
  const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
  const tab=async(nm)=>{await clk(nm,p.locator('nav.fixed'));await p.waitForFunction(()=>!/Chargement…/.test(document.querySelector('main').innerText));await p.waitForTimeout(250);};
  const tall=async(file)=>{const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await p.evaluate(()=>{document.documentElement.style.scrollBehavior='auto';scrollTo(0,0)});await p.waitForTimeout(300);await p.screenshot({path:S+file,fullPage:true,clip:{x:0,y:0,width:p.viewportSize().width,height:1260}});await st.evaluate(e=>e.remove());};
  const h1=()=>p.locator('main h1').first().innerText().catch(()=>'');
  // ---- 1re visite, en ligne ----
  await p.goto(url,{waitUntil:'networkidle'});await hide();
  await p.evaluate(()=>navigator.serviceWorker.ready);
  const pret=p.locator('[data-clr=hors-ligne-pret]');
  await pret.waitFor({timeout:15000}).catch(()=>{});
  ok('en ligne : « ✓ Disponible hors ligne » affiché une fois tout en cache',(await pret.isVisible())&&(await pret.innerText()).trim()==='✓ Disponible hors ligne');
  const core=await p.evaluate(async()=>{const t=await (await fetch('sw.js',{cache:'no-store'})).text();const V=t.match(/const V = '([^']+)'/)[1];const CORE=JSON.parse(t.match(/const CORE = (\[.*\]);/)[1]);
    const c=await caches.open(V);const miss=[];for(const u of CORE)if(!await c.match(u))miss.push(u);return {V,CORE,miss,keys:await caches.keys()};});
  ok('pré-cache : tout le build (JS, CSS, polices, icônes, manifeste, og.jpg) est en cache',core.miss.length===0||core.miss);
  const expect=['assets/index-','.css','References-','Symptomes-','Plantes-','Recettes-','Suivi-','outfit-normal-latin','fraunces-normal-latin','fraunces-italic-latin','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','manifest.webmanifest','favicon.svg','og.jpg'];
  ok('pré-cache : contient chaque type de fichier attendu',expect.every(e=>core.CORE.some(u=>u.includes(e)))||expect.filter(e=>!core.CORE.some(u=>u.includes(e))));
  const built=fs.readdirSync(path.join(ROOT,'assets'));
  if(!process.argv[2])ok('pré-cache : chaque fichier de assets/ est listé',built.every(f=>core.CORE.includes('/combat-le-rhume/assets/'+f))||built.filter(f=>!core.CORE.includes('/combat-le-rhume/assets/'+f)));
  ok('une seule version de cache',core.keys.filter(k=>k.startsWith('clr-')).length===1||core.keys);
  ok('le service worker contrôle la page',await p.evaluate(()=>!!navigator.serviceWorker.controller));
  // ---- tout hors ligne ----
  await ctx.setOffline(true);offline=true;
  await p.reload({waitUntil:'load'});await p.waitForTimeout(600);await hide();
  ok('hors ligne : rechargement → l’appli s’affiche',(await p.locator('header').innerText()).includes('Combat le')&&await p.locator('main').isVisible());
  ok('hors ligne : navigator.onLine = false',await p.evaluate(()=>navigator.onLine===false));
  await clk('Commencer').catch(()=>{});await hide();
  ok('Accueil : « Choisis ton mode »',(await h1())==='Choisis ton mode');
  const ac=p.locator('[data-clr=accueil-references]');
  const st=await ac.locator('[data-stat]').evaluateAll(ls=>ls.map(l=>+l.querySelector('.clr-refs-stat-n').textContent));
  ok(`Accueil : bloc Références ${STATS.join(' / ')}`,JSON.stringify(st)===JSON.stringify(STATS)||st);
  ok(`Accueil : ligne 🌍 internationale (${INTLM.posts+INTLM.etudes})`,(await ac.locator('[data-clr=accueil-international]').innerText()).includes(`${INTLM.posts+INTLM.etudes} références internationales`));
  ok('Accueil : « ✓ Disponible hors ligne » (hors ligne aussi)',await pret.isVisible());
  await p.evaluate(()=>document.fonts.ready);
  ok('polices Outfit + Fraunces chargées hors ligne',await p.evaluate(()=>document.fonts.check('400 16px Outfit')&&document.fonts.check('600 16px Outfit')&&document.fonts.check('650 20px Fraunces')&&document.fonts.check('italic 560 20px Fraunces')&&[...document.fonts].some(f=>f.family.includes('Outfit')&&f.status==='loaded')&&[...document.fonts].some(f=>f.family.includes('Fraunces')&&f.status==='loaded')));
  ok('icônes, manifeste, favicon, og.jpg servis hors ligne',await p.evaluate(async()=>{const r=await Promise.all(['icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png','icons/apple-touch-icon.png','manifest.webmanifest','favicon.svg','og.jpg'].map(u=>fetch(u).then(x=>x.ok&&x.status).catch(()=>0)));return r.every(x=>x===200)||r;}));
  if(dn==='iphone13'){await tall('offline-accueil.png');const ft=p.locator('[data-clr=hors-ligne-pret]');await ft.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';e.scrollIntoView({block:'center'})});await p.waitForTimeout(300);await p.screenshot({path:S+'offline-indicateur.png'});}
  // chaque section
  const want={'Symptômes':/Symptômes|symptôme/i,'Remèdes':/Remèdes|remède/i,'Plantes':/Plantes/,'Recettes':/Recettes/,'Suivi':/Suivi/};
  for(const [t,re] of Object.entries(want)){await tab(t);const m=await p.locator('main').innerText();ok(`${t} : section affichée hors ligne`,re.test(await h1()+' '+m)&&m.length>300||[await h1(),m.length]);}
  await clk('Conseils');ok('Conseils : affichés hors ligne',(await p.locator('main').innerText()).length>300);
  await tab('Accueil');await p.locator('[data-clr=accueil-references-btn]').click();await p.waitForFunction(()=>document.querySelector('main h1')?.innerText==='Références');
  ok(`Références : ${NGROUPS} thèmes hors ligne`,await p.locator('[data-ref-group]').count()===NGROUPS);
  ok('Références : publications et études affichées',await p.locator('[data-ref]').count()>=150&&await p.locator('[data-etude]').count()>=200||[await p.locator('[data-ref]').count(),await p.locator('[data-etude]').count()]);
  // lien externe hors ligne → petit message, pas de page cassée
  const pages0=ctx.pages().length;const lien=p.locator('main a[href^="https://x.com"]').first();await lien.scrollIntoViewIfNeeded();
  await lien.click();await p.waitForTimeout(400);
  const msg=p.locator('[data-clr=lien-hors-ligne]');
  ok('lien X hors ligne : message « Pas de connexion : ce lien s’ouvrira quand tu seras en ligne. »',(await msg.isVisible())&&(await msg.innerText()).includes('Pas de connexion : ce lien s’ouvrira quand tu seras en ligne.'));
  ok('lien X hors ligne : aucun onglet ouvert, on reste dans l’appli',ctx.pages().length===pages0&&(await h1())==='Références');
  if(dn==='iphone13'){await p.screenshot({path:S+'offline-lien.png'});}
  await msg.getByRole('button',{name:'OK'}).click();await p.waitForTimeout(200);
  const etude=p.locator('main a[data-pubmed]').first();await etude.scrollIntoViewIfNeeded();await etude.click();await p.waitForTimeout(400);
  ok('lien PubMed hors ligne : même message',await msg.isVisible()&&ctx.pages().length===pages0);
  if(dn==='iphone13'){await msg.getByRole('button',{name:'OK'}).click();await tall('offline-refs.png');}
  else await msg.getByRole('button',{name:'OK'}).click();
  // Mode Combat + kit, Enfant, Mode Soutien, état enregistré
  await tab('Accueil');await p.locator('.clr-choice-combat button').first().click();await p.waitForTimeout(600);
  ok('Mode Combat : activé hors ligne',await p.evaluate(()=>document.documentElement.classList.contains('mode-combat')));
  await tab('Remèdes');
  ok('Mode Combat : protocole + Kit Combat affichés',await p.locator('[data-clr=panel]').first().isVisible()&&await p.locator('[data-clr=kit]').count()===1);
  const kit=p.locator('[data-clr=kit] input[type=checkbox]');await kit.first().scrollIntoViewIfNeeded();await kit.first().check();await p.waitForTimeout(200);
  await clk('Enfant');
  ok('Enfant : basculé hors ligne',await p.getByRole('button',{name:'Enfant',exact:true}).first().getAttribute('aria-pressed')==='true');
  await p.reload({waitUntil:'load'});await p.waitForTimeout(800);await hide();
  ok('état enregistré après rechargement hors ligne : Mode Combat',await p.evaluate(()=>document.documentElement.classList.contains('mode-combat')));
  ok('état enregistré après rechargement hors ligne : Enfant',await p.getByRole('button',{name:'Enfant',exact:true}).first().getAttribute('aria-pressed')==='true');
  await tab('Remèdes');
  ok('état enregistré après rechargement hors ligne : case du kit cochée',await p.locator('[data-clr=kit] input[type=checkbox]:checked').count()>=1);
  await p.locator('[data-clr=changer-mode]').getByRole('button',{name:'Passer au Mode Soutien'}).first().click().catch(async()=>{await tab('Accueil');await p.locator('.clr-choice-soutien button').first().click();});
  await p.waitForTimeout(500);
  ok('Mode Soutien : activé hors ligne',await p.evaluate(()=>document.documentElement.classList.contains('mode-soutien')));
  await clk('Adulte');await tab('Plantes');ok('Mode Soutien : Plantes affichées',(await p.locator('main').innerText()).length>300);
  await p.getByRole('button',{name:/Passer en mode (sombre|clair)/}).first().click();await p.waitForTimeout(200);
  ok('mode sombre hors ligne',await p.evaluate(()=>document.documentElement.classList.contains('dark')));
  await p.getByRole('button',{name:/Passer en mode (sombre|clair)/}).first().click();
  // navigations directes hors ligne (adresse avec paramètres, index.html, autre chemin)
  for(const u of [url+'?utm_source=partage',url+'index.html',url+'references']){await p.goto(u,{waitUntil:'load'});await p.waitForTimeout(500);ok(`navigation hors ligne vers ${u.replace(origin,'')} → l’appli`,(await p.locator('header').innerText()).includes('Combat le'));}
  ok('0 requête en échec pendant tout le hors ligne (même origine)',failed.filter(f=>f.startsWith(origin)).length===0||failed);
  ok('0 requête externe tentée en échec',failed.length===0||failed);
  // repli de navigation : si la page de l’appli manquait du cache → page « Pas de connexion » en français, pas l’erreur du navigateur
  await p.evaluate(async()=>{for(const k of await caches.keys()){const c=await caches.open(k);await c.delete(new URL('./',location.href).pathname);}});
  await p.goto(url+'?repli='+Date.now(),{waitUntil:'load'});
  ok('repli hors ligne (page absente du cache) : « Pas de connexion » en français',(await p.locator('h1').first().innerText())==='Pas de connexion'&&(await p.locator('body').innerText()).includes('Ouvre-la une fois avec une connexion'));
  ok('aucune erreur JavaScript',errs.length===0||errs);
  await ctx.close();
 }
 if(srv)srv.close();
 // ---- mise à jour : une nouvelle version publiée arrive (bannière « Une nouvelle version est prête. ») ----
 {const dn='mise-a-jour';const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'clr-maj-'));copySite(dir);const s2=await serve(dir);const u2=`http://127.0.0.1:${s2.address().port}/combat-le-rhume/`;
  const ctx=await b.newContext({...devices['iPhone 13'],locale:'fr-CA'});const p=await ctx.newPage();const failed=[];let offline=false;
  ctx.on('requestfailed',r=>{if(offline)failed.push(r.url());});
  await p.goto(u2,{waitUntil:'networkidle'});await p.evaluate(()=>navigator.serviceWorker.ready);await p.locator('[data-clr=hors-ligne-pret]').waitFor({timeout:15000});
  const v1=await p.evaluate(async()=>(await caches.keys()).filter(k=>k.startsWith('clr-')));
  ok('v1 en cache, pas de bannière',v1.length===1&&!(await p.locator('[data-clr=mise-a-jour]').count()));
  // nouvelle version publiée (index.html modifié + sw.js avec une nouvelle version), le cache HTTP garde l’ancienne page 10 minutes
  const sw=fs.readFileSync(path.join(dir,'sw.js'),'utf8').replace(/const V = '[^']+'/,"const V = 'clr-maj-test'");fs.writeFileSync(path.join(dir,'sw.js'),sw);
  fs.writeFileSync(path.join(dir,'index.html'),fs.readFileSync(path.join(dir,'index.html'),'utf8').replace('<head>','<head><meta name="clr-test-version" content="v2">'));
  await p.reload({waitUntil:'load'});
  const toast=p.locator('[data-clr=mise-a-jour]');await toast.waitFor({timeout:15000}).catch(()=>{});
  ok('bannière « Une nouvelle version est prête. » + Recharger',(await toast.isVisible())&&(await toast.innerText()).includes('Une nouvelle version est prête.')&&await toast.getByRole('button',{name:'Recharger'}).isVisible());
  await toast.getByRole('button',{name:'Recharger'}).click();await p.waitForLoadState('load');await p.waitForTimeout(800);
  ok('après Recharger : la nouvelle version est affichée',await p.locator('meta[name=clr-test-version]').count()===1);
  ok('ancien cache supprimé, seul le nouveau reste',JSON.stringify(await p.evaluate(async()=>(await caches.keys()).filter(k=>k.startsWith('clr-'))))==='["clr-maj-test"]');
  ok('nouvelle version : « ✓ Disponible hors ligne »',await p.locator('[data-clr=hors-ligne-pret]').isVisible());
  await ctx.setOffline(true);offline=true;await p.reload({waitUntil:'load'});await p.waitForTimeout(600);
  ok('nouvelle version hors ligne : page à jour (pas l’ancienne du cache HTTP) et appli affichée',await p.locator('meta[name=clr-test-version]').count()===1&&(await p.locator('header').innerText()).includes('Combat le'));
  for(const t of ['Symptômes','Plantes','Suivi']){await p.locator('nav.fixed').getByRole('button',{name:t}).click().catch(()=>{});await p.waitForTimeout(500);}
  ok('nouvelle version hors ligne : 0 requête en échec',failed.length===0||failed);
  await ctx.close();s2.close();fs.rmSync(dir,{recursive:true,force:true});}
 await b.close();console.log(`\n${n-fail}/${n} ok, ${fail} échec(s)`);process.exit(fail?1:0);})();
