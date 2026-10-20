// v5 : nouveaux tests de la refonte v4 — accueil, Suivi (migration, export, import, effacement), sections repliables,
// installation, partage, h1, cibles ≥ 44 px, axe, hauteurs de page. usage: node clr-v5-new.js <url> <tag>
const {chromium,devices}=require('playwright');const fs=require('fs');const {MEASURE}=require('./clr-taps.js');
const [url,tag]=process.argv.slice(2);const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/v5_';
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const pad=n=>String(n).padStart(2,'0');const dk=t=>{const d=new Date(t);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`};
(async()=>{const b=await chromium.launch();const all={};let fail=0;const metrics={};
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const R={};const errs=[];const M=metrics[dn]={};
 const ok=(k,v)=>{R[k]=v;if(v!==true){fail++;console.log('FAIL',dn,k,JSON.stringify(v).slice(0,400))}};
 const mk=async(extra={})=>{const c=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto',acceptDownloads:true,...extra});await c.grantPermissions(['clipboard-read','clipboard-write','notifications'],{origin:new URL(url).origin});const p=await c.newPage();
  p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));return [c,p]};
 const H=p=>({
  btn:async n=>{const l=p.getByRole('button',{name:n,exact:typeof n==='string'});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible())return l.nth(i);return null},
  click:async function(n){const l=await this.btn(n);if(!l)throw new Error('no button '+n);await l.click();await p.waitForTimeout(250)},
  main:async()=>(await p.locator('main').innerText()).replace(/\s+/g,' '),
  h1s:async()=>p.$$eval('h1',hs=>hs.filter(h=>h.offsetParent||h.getClientRects().length).map(h=>h.innerText.trim())),
  axe:async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});return p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+' ('+v.nodes.length+') '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')))},
  taps:async()=>[...new Set(await p.evaluate(MEASURE))],
  openAll:async()=>{for(const h of await p.$$('main button[aria-expanded=false]'))if(await h.isVisible()){await h.click();await p.waitForTimeout(20)}},
  ls:async k=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),k),
 });
 const screens={axe:{},taps:{},h1:{}};
 const audit=async(h,name)=>{screens.axe[name]=await h.axe();screens.taps[name]=await h.taps();screens.h1[name]=await h.h1s()};

 // ---------- 1. accueil sans mode ----------
 let [c,p]=await mk();let h=H(p);
 await p.goto(url,{waitUntil:'networkidle'});
 let t=await h.main();
 ok('onboarding h1',JSON.stringify(await h.h1s())==='["Combat le rhume, en bref"]');
 ok('onboarding 3 lines',await p.locator('[data-onboarding] ul li').count()===3);
 ok('onboarding 2 modes + 1 sentence each',t.includes('Mode Combat Dès le premier mal de gorge : cinq gestes, un point matin et soir, pendant 3 jours.')&&t.includes('Mode Soutien Pour la suite : vitamine D, zinc, plantes, hydratation et repos.'));
 ok('onboarding: chooser not yet shown',!t.includes('Choisis ton mode'));
 await audit(h,'onboarding');
 if(dn==='iphone13')await p.locator('[data-install] button[aria-label^=Masquer]').click().catch(()=>{});
 await p.screenshot({path:S+`${dn}-accueil-onboarding.png`});
 await h.click('Commencer');
 ok('Commencer -> chooser h1 focused',await p.evaluate(()=>document.activeElement?.tagName==='H1'&&document.activeElement.innerText.trim()==='Choisis ton mode'));
 await audit(h,'chooser');
 await p.reload({waitUntil:'networkidle'});ok('onboarding remembered',!(await h.main()).includes('Combat le rhume, en bref')&&(await h.main()).includes('Choisis ton mode'));

 // ---------- 2. sections repliables + Sur cette page ----------
 await h.click('Mode Soutien');
 const secs=await p.$$eval('main [data-section]',s=>s.map(x=>x.id));
 ok('soutien: 9 collapsible sections',secs.length===9||secs);
 ok('soutien: collapsed by default',await p.$$eval('main [data-section] > div button[aria-expanded]',bs=>bs.every(b=>b.getAttribute('aria-expanded')==='false')));
 ok('soutien: content hidden',!(await h.main()).includes('Dose courante chez l’adulte'));
 M.soutienHeight=await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight,+(document.documentElement.scrollHeight/innerHeight).toFixed(2)]);
 ok('soutien home ≤ 3 screens',M.soutienHeight[2]<=3||M.soutienHeight);
 await p.screenshot({path:S+`${dn}-soutien-accueil-replie.png`,fullPage:true});
 await audit(h,'soutien-collapsed');
 await p.locator('#vitamine-d button[aria-expanded]').click();await p.waitForTimeout(200);
 ok('section opens on tap',await p.locator('#vitamine-d button[aria-expanded]').getAttribute('aria-expanded')==='true'&&(await h.main()).includes('Dose courante chez l’adulte'));
 await p.locator('#vitamine-d button[aria-expanded]').click();
 await h.click(/^Sur cette page/);const items=await p.locator('#sur-cette-page button').count();
 ok('Sur cette page lists sections',items===9||items);
 await p.locator('#sur-cette-page button',{hasText:'Prévention'}).click();await p.waitForTimeout(900);
 ok('menu opens + scrolls to section',await p.locator('#prevention button[aria-expanded]').getAttribute('aria-expanded')==='true'&&await p.evaluate(()=>{const r=document.getElementById('prevention').getBoundingClientRect();return r.top>=0&&r.top<innerHeight}));
 await h.openAll();await audit(h,'soutien-open');
 for(const tab of ['Symptômes','Plantes','Recettes']){await h.click(tab);await h.openAll();if(tab==='Recettes'){const v=p.getByRole('button',{name:/Voir|Ouvrir/});if(await v.count())await v.first().click()}await audit(h,tab)}
 await h.click('Conseils');await audit(h,'conseils');
 await h.click('Remèdes');
 const rsecs=await p.locator('main [data-section]').count();
 ok('remedes: collapsible cards (Soutien: 13)',rsecs===13||rsecs);
 ok('remedes: collapsed by default',await p.$$eval('main [data-section] > div button[aria-expanded]',bs=>bs.every(b=>b.getAttribute('aria-expanded')==='false')));
 M.remedesHeight=await p.evaluate(()=>[document.documentElement.scrollHeight,innerHeight,+(document.documentElement.scrollHeight/innerHeight).toFixed(2)]);
 ok('remedes ≤ 3 screens',M.remedesHeight[2]<=3||M.remedesHeight);
 await p.screenshot({path:S+`${dn}-remedes-replie.png`,fullPage:false});
 await audit(h,'remedes-collapsed');
 await h.click(/^Sur cette page/);ok('remedes menu',await p.locator('#sur-cette-page button').count()===13);
 await p.locator('#sur-cette-page button',{hasText:'Thym'}).click();await p.waitForTimeout(900);
 ok('remedes menu opens Thym',await p.locator('#remede-thym button[aria-expanded]').getAttribute('aria-expanded')==='true');
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('sureau');await p.waitForTimeout(200);
 ok('search opens matching cards',(await h.main()).includes('Sureau noir')&&await p.locator('main [data-section] button[aria-expanded=true]').count()>=1);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 await h.openAll();await audit(h,'remedes-open');
 // favori garde après rechargement
 await p.getByRole('button',{name:'Ajouter Ail, vinaigre de cidre et miel aux favoris'}).click();
 await c.close();

 // ---------- 3. Suivi : migration depuis les anciennes clés ----------
 [c,p]=await mk();h=H(p);
 await p.goto(url,{waitUntil:'networkidle'});
 const now=Date.now(),D=864e5;
 const seed={prefs:{audience:'adulte',favorites:['ail'],theme:'clair',stance:'combat'},
  journal:[{date:dk(now-2*D),intensity:6,symptoms:['toux'],notes:'Note A',protocol:['hydratation']},{date:dk(now-D),intensity:5,symptoms:['fievre','toux'],notes:'Note B',protocol:[]},{date:'mauvais',intensity:'x'}],
  combat:{protocol:{start:now-D-3600e3,audience:'adulte'},intakes:[{g:'betadine',t:now-D},{g:'miel',t:now-D+60e3},{g:'betadine',t:now-3600e3}],
   checks:[{gorge:6,fievre:false,frissons:false,tete:'non',avaler:false,respirer:false,day:dk(now-D),slot:'matin',t:now-D},{gorge:4,fievre:false,frissons:false,tete:'non',avaler:false,respirer:false,day:dk(now-D),slot:'soir',t:now-D+600e3}],
   intervals:{miel:2},kit:['thermometre','miel'],reminders:false,history:[{start:now-20*D,end:now-17*D,status:'termine'}]}};
 await p.evaluate(s=>{localStorage.clear();localStorage.setItem('remedes-naturels-prefs-v1',JSON.stringify(s.prefs));localStorage.setItem('remedes-naturels-journal-v1',JSON.stringify(s.journal));localStorage.setItem('combat-le-rhume-combat-v1',JSON.stringify(s.combat))},seed);
 await p.reload({waitUntil:'networkidle'});
 const u=await h.ls('combat-le-rhume-suivi-v1');
 ok('migration: unified key created',!!u&&u.version===1);
 ok('migration: journal kept (valid entries)',JSON.stringify(u.journal)===JSON.stringify(seed.journal.slice(0,2).sort((a,b)=>b.date.localeCompare(a.date))));
 ok('migration: combat kept',JSON.stringify([u.protocol,u.intakes,u.checks,u.intervals,u.kit,u.reminders,u.history])===JSON.stringify([seed.combat.protocol,seed.combat.intakes,seed.combat.checks,seed.combat.intervals,seed.combat.kit,seed.combat.reminders,seed.combat.history]));
 ok('migration: old keys left as backup',!!(await h.ls('remedes-naturels-journal-v1'))&&!!(await h.ls('combat-le-rhume-combat-v1')));
 ok('existing user: no onboarding',!(await h.main()).includes('Combat le rhume, en bref'));
 await h.click('Remèdes');
 t=(await p.locator('[data-clr=consulter]').first().innerText()).replace(/\s+/g,' ');
 ok('combat logic reads unified data (fièvre du journal)',t.includes('Il vaut mieux consulter')&&t.includes('Fièvre'));
 ok('combat warm advice off from journal fever',(await p.locator('main h1 + p').innerText()).includes('pas de surchauffe ni de tuque'));
 ok('kit migrated in UI',(await p.locator('[data-clr=kit]').innerText()).includes('2 / 11'));
 await h.click('Suivi');t=await h.main();
 ok('Suivi always reachable in Combat',JSON.stringify(await h.h1s())==='["Suivi"]');
 ok('Suivi merges journal + checks',t.includes('Note A')&&t.includes('Note B')&&t.includes('Matin : gorge 6/10')&&t.includes('Soir : gorge 4/10')&&await p.locator('[data-clr=point]').isVisible());
 ok('Suivi shows consult from unified data',await p.locator('[data-clr=consulter]').isVisible());
 await audit(h,'suivi-combat');
 await p.screenshot({path:S+`${dn}-suivi.png`,fullPage:false});
 await p.locator('[data-suivi=donnees]').scrollIntoViewIfNeeded();await p.locator('[data-suivi=donnees]').screenshot({path:S+`${dn}-suivi-donnees.png`});
 // journal du jour
 await h.click('Fatigue');await h.click('Enregistrer le jour');
 // ---------- export ----------
 let [dl]=await Promise.all([p.waitForEvent('download'),h.click('Exporter mes données (JSON)')]);
 const exp=JSON.parse(fs.readFileSync(await dl.path(),'utf8'));const cur=await h.ls('combat-le-rhume-suivi-v1');
 ok('export JSON = stored data',exp.app==='combat-le-rhume'&&exp.version===1&&JSON.stringify(exp.data)===JSON.stringify(cur)&&/combat-le-rhume-suivi-\d{4}-\d{2}-\d{2}\.json/.test(dl.suggestedFilename()));
 [dl]=await Promise.all([p.waitForEvent('download'),h.click('Exporter en CSV')]);
 const csv=fs.readFileSync(await dl.path(),'utf8');const lines=csv.replace(/^\uFEFF/,'').trim().split(/\r\n/);if(process.env.DBG)console.log(JSON.stringify(csv.slice(0,600)),lines.length,cur.journal.length,cur.checks.length,cur.intakes.length,cur.history.length);
 ok('export CSV',csv.charCodeAt(0)===0xFEFF&&lines[0].startsWith('type;date;moment;heure')&&lines.length===1+cur.journal.length+cur.checks.length+cur.intakes.length+cur.history.length+(cur.protocol?1:0)&&csv.includes('Note A')&&csv.includes('point;'+dk(now-D)+';matin'));
 // ---------- import ----------
 const file=p.locator('input[data-suivi=fichier]');
 await file.setInputFiles({name:'x.json',mimeType:'application/json',buffer:Buffer.from('pas du json')});await p.waitForTimeout(200);
 ok('import: invalid JSON refused',(await h.main()).includes('pas un JSON valide')&&JSON.stringify(await h.ls('combat-le-rhume-suivi-v1'))===JSON.stringify(cur));
 await file.setInputFiles({name:'x.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,journal:[{date:'2026-13-99',intensity:'fort'}]}))});await p.waitForTimeout(200);
 ok('import: bad schema refused',(await h.main()).includes('Fichier refusé')&&JSON.stringify(await h.ls('combat-le-rhume-suivi-v1'))===JSON.stringify(cur));
 const mod=JSON.parse(JSON.stringify(exp));mod.data.journal.push({date:dk(now-5*D),intensity:2,symptoms:[],notes:'Importée',protocol:[]});
 await file.setInputFiles({name:'x.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(mod))});await p.waitForTimeout(200);
 ok('import: preview + confirm',(await h.main()).includes('Fichier valide')&&JSON.stringify(await h.ls('combat-le-rhume-suivi-v1'))===JSON.stringify(cur));
 await h.click('Remplacer mes données');
 ok('import: data replaced',(await h.ls('combat-le-rhume-suivi-v1')).journal.length===cur.journal.length+1&&(await h.main()).includes('Importée'));
 await p.reload({waitUntil:'networkidle'});await h.click('Suivi');ok('import persists',(await h.main()).includes('Importée'));
 // ---------- tout effacer ----------
 await h.click('Tout effacer');ok('reset asks confirmation',(await h.main()).includes('Effacer tout le suivi de cet appareil ?')&&!!(await h.ls('combat-le-rhume-suivi-v1')).journal.length);
 await h.click('Non, garder');ok('reset cancel keeps data',(await h.ls('combat-le-rhume-suivi-v1')).journal.length===cur.journal.length+1);
 await h.click('Tout effacer');await h.click('Oui, tout effacer');
 const z=await h.ls('combat-le-rhume-suivi-v1');
 ok('reset clears all',z.journal.length===0&&z.checks.length===0&&z.intakes.length===0&&z.protocol===null&&z.kit.length===0&&!(await h.ls('remedes-naturels-journal-v1'))&&!(await h.ls('combat-le-rhume-combat-v1')));
 ok('reset keeps prefs',JSON.stringify((await h.ls('remedes-naturels-prefs-v1')).favorites)==='["ail"]');
 await p.reload({waitUntil:'networkidle'});await h.click('Suivi');ok('reset persists (no re-migration)',(await h.main()).includes('Aucune journée enregistrée'));
 // combat screens audit
 await h.click('Remèdes');await h.click('J’ai mal à la gorge, je commence');await h.click('Intervalles et rappels');await audit(h,'combat-remedes');
 await h.click('Suivi');await h.click('Difficulté à respirer');await h.click(/^Enregistrer \(/);await audit(h,'combat-suivi-urgent');
 await h.click('Accueil');await audit(h,'combat-accueil');await h.click('Conseils');await audit(h,'combat-conseils');
 await h.click('Passer en mode sombre');await audit(h,'sombre');
 await c.close();

 // ---------- 4. installation ----------
 [c,p]=await mk();h=H(p);await p.goto(url,{waitUntil:'networkidle'});
 if(dn==='iphone13'){
  ok('iPhone: install instructions',(await p.locator('[data-install=ios]').innerText()).includes('Sur l’écran d’accueil'));
  await p.screenshot({path:S+`${dn}-installer.png`});await audit(h,'install-banner');
 }else{
  ok('desktop: no banner without prompt',await p.locator('[data-install]').count()===0);
  await p.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=()=>{window.__prompted=true};e.userChoice=Promise.resolve({outcome:'accepted'});dispatchEvent(e)});await p.waitForTimeout(200);
  ok('Android-style prompt banner',await p.locator('[data-install=android]').isVisible());
  await p.screenshot({path:S+`${dn}-installer.png`});await audit(h,'install-banner');
  await h.click('Installer');ok('Installer calls prompt + hides',await p.evaluate(()=>window.__prompted===true)&&await p.locator('[data-install]').count()===0);
  await p.reload({waitUntil:'networkidle'});
  await p.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=()=>{};e.userChoice=Promise.resolve({outcome:'dismissed'});dispatchEvent(e)});await p.waitForTimeout(200);
 }
 await p.locator('[data-install] button[aria-label^=Masquer]').click();ok('banner dismissible',await p.locator('[data-install]').count()===0);
 await p.reload({waitUntil:'networkidle'});if(dn!=='iphone13')await p.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=()=>{};e.userChoice=Promise.resolve({});dispatchEvent(e)});await p.waitForTimeout(200);
 ok('dismiss remembered',await p.locator('[data-install]').count()===0);
 await c.close();
 [c,p]=await mk();await p.addInitScript(()=>{const mm=window.matchMedia.bind(window);window.matchMedia=q=>q.includes('display-mode: standalone')?{matches:true,media:q,addEventListener(){},removeEventListener(){}}:mm(q)});
 await p.goto(url,{waitUntil:'networkidle'});await p.evaluate(()=>{const e=new Event('beforeinstallprompt',{cancelable:true});e.prompt=()=>{};e.userChoice=Promise.resolve({});dispatchEvent(e)});await p.waitForTimeout(200);
 ok('hidden when installed (standalone)',await p.locator('[data-install]').count()===0);
 // ---------- 5. partage ----------
 h=H(p);await p.evaluate(()=>{navigator.share=async d=>{window.__shared=d}});
 await h.click('Partager l’appli');ok('Web Share API used',await p.evaluate(u=>window.__shared?.url===u&&window.__shared.title==='Combat le rhume',new URL(url).href));
 await p.evaluate(()=>{navigator.share=undefined});await h.click('Partager l’appli');await p.waitForTimeout(200);
 ok('copy-link fallback',(await p.locator('[role=status]',{hasText:'Lien copié'}).count())===1&&await p.evaluate(()=>navigator.clipboard.readText())===new URL(url).href);
 await c.close();

 // ---------- bilan ----------
 const axeBad=Object.entries(screens.axe).filter(([,v])=>v.length);ok('axe: 0 violations on '+Object.keys(screens.axe).length+' screens',axeBad.length===0||axeBad);
 const tapBad=Object.entries(screens.taps).filter(([,v])=>v.length);ok('tap targets ≥ 44 px on '+Object.keys(screens.taps).length+' screens',tapBad.length===0||tapBad);
 const h1Bad=Object.entries(screens.h1).filter(([,v])=>v.length!==1);ok('exactly one h1 on '+Object.keys(screens.h1).length+' screens',h1Bad.length===0||h1Bad);
 ok('zero console errors',errs.length===0||errs);
 M.screens=Object.keys(screens.axe);all[dn]=R;}
fs.writeFileSync(S+tag+'-new-result.json',JSON.stringify({results:all,metrics},null,1));
console.log(tag,'checks:',Object.values(all).map(r=>Object.keys(r).length),'failures:',fail);console.log(JSON.stringify(metrics));await b.close();})();
