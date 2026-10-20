// v5 : Mode Combat concentré (structure refonte v4). usage: node clr-v5-focus.js <url> <tag>
const {chromium,devices}=require('playwright');const fs=require('fs');
const [url,tag]=process.argv.slice(2);const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/v5_focus_';
(async()=>{const b=await chromium.launch();const all={};let fail=0;
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[],R={};
 const ok=(k,v)=>{R[k]=v;if(v!==true){fail++;console.log('FAIL',dn,k,v)}};
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const vis=async n=>{const l=p.getByRole('button',{name:n,exact:typeof n==='string'});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible())return l.nth(i);return null;};
 const click=async n=>{const l=await vis(n);if(!l)throw new Error('no button '+n);await l.click();await p.waitForTimeout(300);};
 const main=async()=>(await p.locator('main').first().innerText()).replace(/\s+/g,' ');
 const navLabels=async()=>p.$$eval('nav[aria-label=Sections] button',bs=>[...new Set(bs.filter(b=>b.offsetParent).map(b=>b.innerText.trim()))]);
 const full=async n=>p.screenshot({path:S+`${dn}-${n}.png`,fullPage:true});
 await p.goto(url,{waitUntil:'networkidle'});
 ok('no-mode nav 6 tabs (Suivi)',(await navLabels()).length===6);
 await click('Commencer');await click('Mode Combat');
 ok('combat nav only Accueil+Remèdes+Suivi',JSON.stringify(await navLabels())==='["Accueil","Remèdes","Suivi"]');
 let t=await main();
 ok('remedes: no search',await p.getByPlaceholder('Rechercher un remède ou un symptôme…').count()===0);
 ok('remedes: 5 gestes cards',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5);
 ok('remedes: keeps panel/consult/kit/warm',t.includes('J’ai mal à la gorge, je commence')&&t.includes('QUAND ARRÊTER ET CONSULTER')&&t.includes('Kit Combat')&&t.includes('même un bonnet'));
 ok('remedes: mode switch',t.includes('CHANGER DE MODE')&&t.includes('Voir tous les remèdes'));
 await full('1-remedes');
 await click('Accueil');t=await main();
 const gone=['Symptômes typiques','Protocole recommandé','Protocole du jour','Vitamine D et soleil','Quoi faire, quoi éviter','Où en es-tu','Plantes pour la toux','Prévention','Frapper fort dès le début'];
 ok('accueil: general sections hidden',gone.filter(x=>t.includes(x)).length===0||gone.filter(x=>t.includes(x)).join(','));
 ok('accueil: keeps disclaimer, chooser, logique, warm, protocol, consult',t.includes('Avertissement')&&t.includes('Choisis ton mode')&&t.includes('Logique des remèdes prioritaires')&&t.includes('avoir très chaud, même avec un bonnet')&&t.includes('PLAN D’ATTAQUE · 3 JOURS')&&t.includes('QUAND ARRÊTER ET CONSULTER'));
 await full('2-accueil');
 await click('Conseils');t=await main();
 ok('conseils combat focused',t.includes('Conseils · Mode Combat')&&!t.includes('Prévention')&&!t.includes('Nicotine')&&!t.includes('Vapotage')&&t.includes('Dormir au chaud')&&t.includes('Miel : jamais'));
 await full('3-conseils');
 // reload keeps focus, hidden tab redirect
 await p.reload({waitUntil:'networkidle'});ok('reload keeps combat nav',JSON.stringify(await navLabels())==='["Accueil","Remèdes","Suivi"]');
 // start from accueil
 await click('J’ai mal à la gorge, je commence');t=await main();ok('home start opens protocol',t.includes('Jour 1 sur 3')&&(await p.locator('main h1').first().innerText())==='Mode Combat');
 await click('Accueil');ok('home shows day',(await main()).includes('Jour 1 sur 3')&&(await main()).includes('Gestes faits aujourd’hui : 0 sur 5'));
 await click('Ouvrir mon protocole');await click('Faire le point dans Suivi');
 // fever hides warm in conseils
 await click('Soir');await p.getByRole('group',{name:'Fièvre'}).getByRole('button',{name:'Oui'}).click();await click(/^(Enregistrer|Mettre à jour) \(soir\)/);
 await click('Conseils');t=await main();ok('conseils: warm hidden after fever',!t.includes('Dormir au chaud')&&t.includes('Il vaut mieux consulter'));
 // voir tous les remèdes
 await click('Voir tous les remèdes');t=await main();
 ok('voir tous -> full list',(await p.locator('main h1').first().innerText())==='Remèdes'&&await p.getByPlaceholder('Rechercher un remède ou un symptôme…').count()===1&&await p.locator('main h2').count()>8);
 ok('nav back to 6',(await navLabels()).length===6);
 // back to combat then soutien via switch
 await click('Accueil');await click('Mode Combat');await click('Accueil');await p.locator('[data-clr=changer-mode]').getByRole('button',{name:'Passer au Mode Soutien'}).click();await p.waitForTimeout(300);
 t=await main();ok('soutien from switch: full accueil',t.includes('Symptômes typiques')&&t.includes('Prévention')&&(await navLabels()).length===6);
 // no empty screens in combat
 await click('Mode Combat');for(const tab of ['Accueil','Remèdes']){await click(tab);ok('non-empty '+tab,(await main()).length>800);}
 await click('Conseils');ok('non-empty conseils',(await main()).length>400);
 ok('zero console errors',errs.length===0||errs.join(' | '));
 all[dn]=R;await ctx.close();}
fs.writeFileSync(S+tag+'-result.json',JSON.stringify(all,null,1));console.log(tag,'checks:',Object.values(all).map(r=>Object.keys(r).length),'failures:',fail);await b.close();})();
