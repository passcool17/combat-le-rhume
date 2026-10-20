// v5 : Mode Combat, parcours complet (structure refonte v4 : Suivi unifié). usage: node clr-v5-combat.js <url> <tag>
const {chromium,devices}=require('playwright');const fs=require('fs');
const [url,tag]=process.argv.slice(2);const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/v5_combat_';
(async()=>{const b=await chromium.launch();const all={};let fail=0;
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});await ctx.grantPermissions(['notifications'],{origin:new URL(url).origin});
 const p=await ctx.newPage();const errs=[],bad=[],R={};const ok=(k,v)=>{R[k]=v;if(v!==true){fail++;console.log('FAIL',dn,k,v)}};
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('response',r=>r.status()>=400&&bad.push(r.status()+' '+r.url()));
 const btn=(n)=>p.getByRole('button',{name:n,exact:typeof n==='string'});
 const vis=async n=>{const l=btn(n);for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible())return l.nth(i);return l.first();};
 const click=async n=>{await (await vis(n)).click();await p.waitForTimeout(250);};
 const txt=async sel=>(await p.locator(sel).first().innerText()).replace(/\s+/g,' ');
 const shot=async(n,sel)=>{if(sel){await p.locator(sel).first().scrollIntoViewIfNeeded();await p.locator(sel).first().screenshot({path:S+`${dn}-${n}.png`});}else await p.screenshot({path:S+`${dn}-${n}.png`});};
 const combat=async()=>{await click('Accueil');await click('Mode Combat');await p.waitForTimeout(300);};
 await p.goto(url,{waitUntil:'networkidle'});await click('Commencer');await combat();
 ok('heading Mode Combat',(await txt('main h1'))==='Mode Combat');
 const navL=await p.$$eval('nav[aria-label=Sections] button',bs=>[...new Set(bs.filter(b=>b.offsetParent).map(b=>b.innerText.trim()))]);ok('combat nav has Suivi',JSON.stringify(navL)==='["Accueil","Remèdes","Suivi"]'||JSON.stringify(navL));
 ok('consult always visible',await p.locator('[data-clr=consulter]').isVisible());
 ok('kit visible',await p.locator('[data-clr=kit]').isVisible());
 ok('warm advice shown by default',(await txt('main')).includes('même un bonnet'));
 ok('precaution iode on card',(await txt('main')).includes('À éviter en cas d’allergie à l’iode, de problème de thyroïde, de grossesse ou d’allaitement.'));
 ok('precaution peroxyde',(await txt('main')).includes('recracher, ne jamais avaler'));
 ok('precaution miel',(await txt('main')).includes('Jamais avant 1 an.'));
 await shot('1-combat-depart','[data-clr=protocole]');
 // 1. démarrer
 await click('J’ai mal à la gorge, je commence');
 ok('protocol started',(await txt('[data-clr=protocole]')).includes('Jour 1 sur 3'));
 ok('start date shown',/Commencé le .+ à \d{1,2} h \d{2}/.test(await txt('[data-clr=protocole]')));
 // 2. checklist
 await click(/Spray povidone-iode 0,45 % : j’ai pris/);await click(/Pastilles antiseptiques : j’ai pris/);await click(/Miel cru : j’ai pris/);
 const pro=await txt('[data-clr=protocole]');
 ok('last + next shown',/Dernière : \d{1,2} h \d{2} · prochaine : \d{1,2} h \d{2}/.test(pro));
 ok('counts',(pro.match(/aujourd’hui : 1 fois/g)||[]).length===3 && pro.includes('aujourd’hui : 0 fois'));
 await click('Intervalles et rappels');
 await p.getByLabel('Intervalle pour Pastilles antiseptiques').selectOption('1');
 ok('interval editable',(await p.getByLabel('Intervalle pour Pastilles antiseptiques').inputValue())==='1');
 await click('Activer');ok('reminders on',(await txt('[data-clr=protocole]')).includes('Rappels activés'));
 await shot('2-checklist','[data-clr=protocole]');
 await click(/Annuler la dernière prise : Miel cru/);ok('undo intake',(await txt('[data-clr=protocole] [data-geste=miel]')).includes('Pas encore pris'));
 // reprise après rechargement
 await p.reload({waitUntil:'networkidle'});await combat();
 ok('protocol resumes after reload',(await txt('[data-clr=protocole]')).includes('Jour 1 sur 3')&&(await txt('[data-geste=betadine]')).includes('Dernière'));
 // 3. symptômes matin/soir + graphique
 await click('Faire le point dans Suivi');ok('suivi has check',await p.locator('[data-clr=point]').isVisible());await click('Matin');await p.locator('#clr-gorge').fill('7');await click(/^Enregistrer \(matin\)/);
 await click('Soir');await p.locator('#clr-gorge').fill('5');await click(/^Enregistrer \(soir\)/);
 ok('chart 2 points',await p.locator('[data-clr=graphique] circle').count()===2);
 // simuler 3 jours : décaler le début de 2 jours et ajouter des relevés
 await p.evaluate(()=>{const k='combat-le-rhume-suivi-v1';const s=JSON.parse(localStorage.getItem(k));const D=864e5;const sh=2*D;s.protocol.start-=sh;s.intakes.forEach(i=>i.t-=sh);s.checks=s.checks.map(c=>{const t=c.t-sh;const d=new Date(t);return{...c,t,day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}});
  const add=(off,slot,g)=>{const t=Date.now()-off*D;const d=new Date(t);s.checks.push({gorge:g,fievre:false,frissons:false,tete:'non',avaler:false,respirer:false,slot,t:t-(slot==='soir'?0:1),day:`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`})};add(1,'matin',4);add(1,'soir',3);add(0,'matin',2);localStorage.setItem(k,JSON.stringify(s));});
 await p.reload({waitUntil:'networkidle'});await combat();
 ok('day 3 shown',(await txt('[data-clr=protocole]')).includes('Jour 3 sur 3'));
 await click('Suivi');ok('chart 5-6 points',await p.locator('[data-clr=graphique] circle').count()>=5);
 await shot('3-graphique','[data-clr=point]');
 // 4. fièvre → consulter, plus de tuque, Mode Soutien
 await click('Soir');await (await p.getByRole('group',{name:'Fièvre'}).getByRole('button',{name:'Oui'})).click();await click(/^(Enregistrer|Mettre à jour) \(soir\)/);
 ok('consult message (Suivi)',(await txt('[data-clr=consulter]')).includes('Il vaut mieux consulter'));
 ok('fever flag highlighted',await p.locator('[data-clr=consulter] li.on',{hasText:'Fièvre'}).count()===1);
 ok('chart fever marker',await p.locator('[data-clr=graphique] circle.warn').count()>=1);await combat();
 const sub=await txt('main h1 + p');ok('warm advice hidden (subtitle)',!sub.includes('bonnet —')&&sub.includes('pas de surchauffe ni de bonnet'));
 await shot('4-fievre-consulter','[data-clr=consulter]');
 await click('Accueil');ok('warm advice hidden (home)',!(await txt('main')).includes('avoir très chaud, même avec un bonnet'));await click('Mode Combat');
 await click('Passer au Mode Soutien');ok('switch to Soutien',(await txt('main h1'))==='Mode Soutien');
 // danger
 // le créneau par défaut suit l'heure réelle : choisir « Soir » explicitement (le test échouait selon l'heure)
 await combat();await click('Suivi');await click('Soir');await click('Difficulté à respirer');await click(/^(Enregistrer|Mettre à jour) \(soir\)/);
 const c2=await txt('[data-clr=consulter]');ok('urgent 811/911',c2.includes('Consulter rapidement')&&await p.locator('[data-clr=consulter] a[href="tel:811"]').isVisible()&&await p.locator('[data-clr=consulter] a[href="tel:911"]').isVisible());
 await shot('5-urgent','[data-clr=consulter]');
 // 5. Enfant
 await combat();await click('Enfant');await p.waitForTimeout(300);
 ok('enfant hides peroxyde card',await p.locator('main h2',{hasText:'Peroxyde d’hydrogène 3 %'}).count()===0);
 ok('enfant hides peroxyde checklist',await p.locator('[data-geste=peroxyde]').count()===0);
 ok('enfant cautions',(await txt('main')).includes('Pas avant 6 ans. À partir de 6 ans, sous surveillance'));
 await shot('6-enfant');await click('Adulte');
 ok('adulte shows peroxyde again',await p.locator('main h2',{hasText:'Peroxyde d’hydrogène 3 %'}).count()===1);
 // 6. kit
 await p.getByLabel('Thermomètre').check();await p.getByLabel('Citrons et tisanes').check();
 await p.reload({waitUntil:'networkidle'});await combat();
 ok('kit persists',await p.getByLabel('Thermomètre').isChecked()&&await p.getByLabel('Citrons et tisanes').isChecked()&&(await txt('[data-clr=kit]')).includes('2 / 11'));
 await shot('7-kit','[data-clr=kit]');
 // offline
 await p.waitForTimeout(1500);await p.reload({waitUntil:'networkidle'});await ctx.setOffline(true);await p.reload();await p.waitForTimeout(1000);await combat();
 ok('offline works',(await txt('[data-clr=protocole]')).includes('Jour 3 sur 3')&&await p.getByLabel('Thermomètre').isChecked());
 await click(/Pastilles antiseptiques : j’ai pris/);ok('offline check works',(await txt('[data-geste=pastilles]')).includes('aujourd’hui : 1 fois'));
 await ctx.setOffline(false);
 ok('sw '+(process.env.SWV||'clr-*'),await p.evaluate(async v=>(await caches.keys()).some(k=>k===v||(v.endsWith('*')&&k.startsWith(v.slice(0,-1)))),process.env.SWV||'clr-*'));
 // terminer + annuler
 await click('Terminer');ok('terminer',(await txt('[data-clr=protocole]')).includes('Dernier protocole')&&(await txt('[data-clr=protocole]')).includes('terminé'));
 ok('warm advice back after end',(await txt('main h1 + p')).includes('même un bonnet'));
 await click('J’ai mal à la gorge, je commence');await click('Annuler le protocole');await click('Oui, annuler et effacer');
 ok('annuler',(await txt('[data-clr=protocole]')).includes('annulé'));
 await p.goto(url,{waitUntil:'networkidle'});await combat();await shot('0-mode-combat');
 await click('Passer en mode sombre');await click('J’ai mal à la gorge, je commence');await shot('8-sombre');
 ok('zero console errors',errs.length===0||errs.join(' | '));ok('no bad requests',bad.length===0||bad.join(' | '));
 all[dn]=R;await ctx.close();}
fs.writeFileSync(S+tag+'-result.json',JSON.stringify(all,null,1));console.log(tag,'checks:',Object.values(all).map(r=>Object.keys(r).length),'failures:',fail);await b.close();})();
