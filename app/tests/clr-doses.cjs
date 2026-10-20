// Doses ajustées selon les références (branche doses-refs) : chaque dose affichée, aucune ancienne dose, zinc (avertissement, caché en profil Enfant), Sécurité.
// usage : node tests/clr-doses.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ');
// Anciennes doses : plus nulle part (sources et pages)
const OLD=[/15\s*[–-]\s*30 mg/,/15 à 30 mg/,/2 000 à 4 000/,/500 mg → 1000 mg/,/2000 mg/,/200 à 400 mg/,/500 mg à 1 g, 2 à 3 fois/,/1 c\. à café à 1 c\. à soupe, 2 à 4 fois/,/7 à 10 jours (maximum|continus)/,/Ne pas dépasser 40 mg/,/vitamine C 1\s*[–-]\s*2 g/,/Gargariser quelques minutes/,/1 c\. à café avant de dormir/,/1 c\. à café pure/,/selon une prise de sang/,/Selon le dosage, pendant/];
const SRC=['data/contenu.js','data/references.js','combat/CombatPlus.jsx','pages/Accueil.jsx','lib/outils.js','pages/Remedes.jsx'].map(f=>fs.readFileSync(path.join(__dirname,'..','src',f),'utf8')).join('\n');
const ZDOSE='Dose des études : pastilles de zinc d’environ 13 mg, 1 pastille toutes les 2 à 3 heures éveillé (≈ 75 à 90 mg par jour), dans les 24 heures des premiers symptômes. 5 à 7 jours maximum. Adulte seulement.';
const ZAV=['Dépasse la limite usuelle de 40 mg par jour : seulement pour une courte durée (5 à 7 jours maximum).','Peut causer nausées et goût métallique. Carence en cuivre si prolongé.','Jamais plus de 100 mg par jour : aucun bénéfice de plus.','Demande avis au pharmacien si tu prends des médicaments ou en cas de grossesse.','Jamais de zinc dans le nez (spray ou gel nasal) : risque de perte de l’odorat.'];
// remède → textes attendus sur la fiche (liste complète, sans mode)
const CARDS={
 zinc:[ZDOSE,...ZAV],
 vitamines:['Vitamine C en soutien : 1 g par jour (par ex. 500 mg, 2 fois par jour). Au-delà de 2 g par jour : risque de diarrhée et de calculs rénaux.','Vitamine D : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour.'],
 'vitamine-c-double':['Dès les premiers symptômes, doubler la dose : 2 g par jour (1 g → 2 g), en 2 à 3 prises avec de l’eau, pendant la durée du rhume ou de la grippe.','Ne pas dépasser 2 g par jour chez l’adulte : au-delà, risque de diarrhée et de calculs rénaux.','hémochromatose'],
 sureau:['Sirop (adulte) : 1 c. à soupe (15 ml), 4 fois par jour pendant 5 jours, à commencer dans les 48 premières heures.'],
 miel:['1 cuillère à soupe de miel seul','Pas dans une tisane, pas de citron.','Ne pas rincer la gorge ni boire juste après','Pour la toux de nuit : 1 c. à soupe de miel seul, 30 min avant le coucher.'],
 peroxyde:['Gargarisme : 1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau. 30 s en bouche + 30 s en gorge, puis recracher. 3 fois par jour, jusqu’à 5 jours. Ne jamais avaler.','Laisser agir 5 minutes maximum'],
 lavage:['Solution saline : jusqu’à 6 fois par jour les 2 premiers jours, puis 1 à 3 fois par jour.'],
 echinacee:['extrait selon l’étiquette, avec des prises augmentées pendant le rhume ou la grippe','Jusqu’à 10 jours.'],
 ail:['Option : ail vieilli en gélules (2,56 g par jour dans une étude), selon l’étiquette.'],
 probiotiques:['ou un complément, selon l’étiquette.'],
 thym:['Sirop : 1 c. à café, 3 à 4 fois par jour.'],
};
const SYMP=['200 à 350 mg le soir, si besoin. Pas plus de 350 mg en supplément.','Adulte : 1 000 à 2 000 UI tous les jours en hiver, plafond 4 000 UI.','Adulte : 1 g par jour en soutien ; 2 g par jour en 2 à 3 prises dès les premiers symptômes. Pas plus de 2 g par jour.','Selon l’étiquette, prises augmentées pendant le rhume ou la grippe, jusqu’à 10 jours.','Sureau (adulte) : 1 c. à soupe 4 fois par jour pendant 5 jours, dans les 48 premières heures.','1 c. à soupe de miel seul, 30 min avant le coucher. Enfant de 1 à 5 ans : 2 c. à thé. Jamais avant 1 an.','3 à 4 fois par jour, et jusqu’à 6 fois par jour les 2 premiers jours.','30 s en bouche + 30 s en gorge, puis recracher. 3 fois par jour, jusqu’à 5 jours.','jusqu’à 6 fois par jour les 2 premiers jours. Peroxyde'];
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const left=OLD.filter(r=>r.test(NB(SRC)));ok('sources : aucune ancienne dose',left.length===0||left.map(String));
  const dist=path.join(__dirname,'..','..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  const leftB=OLD.filter(r=>r.test(NB(js)));ok('site publié : aucune ancienne dose',leftB.length===0||leftB.map(String));
  ok('site publié : nouvelles doses',[ZDOSE,'200 à 350 mg','1 000 à 2 000 UI','2 g par jour (1 g → 2 g)'].every(x=>NB(js).includes(x)));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const main=async()=>NB(await p.locator('main').innerText());
 const noOld=(k,t)=>{const l=OLD.filter(r=>r.test(t));ok(k+' : aucune ancienne dose',l.length===0||l.map(String));};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 // Liste complète des remèdes (sans mode), profil Adulte
 await clk('Remèdes');await hide();await openAll();
 for(const [id,xs] of Object.entries(CARDS)){const c=p.locator('#remede-'+id);const t=(await c.count())?NB(await c.innerText()):'';const miss=xs.filter(x=>!t.includes(x));ok('fiche '+id,miss.length===0||miss);}
 const za=await p.locator('#remede-zinc [data-clr=zinc-avertissement] li').allInnerTexts();ok('fiche zinc : Avertissement (5 lignes)',JSON.stringify(za.map(NB))===JSON.stringify(ZAV)||za);
 ok('fiche zinc : lien Références Zinc (19)',(await p.locator('#remede-zinc [data-ref-link=zinc]').innerText()).includes('Zinc (19)'));
 ok('fiche thym : lien Références Thym',await p.locator('#remede-thym [data-ref-link=thym]').count()===1);
 noOld('remèdes',await main());
 await clk('Symptômes');await hide();
 for(let k=0;k<12;k++){const l=p.locator('main button[aria-pressed=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(120);}
 await openAll();let sy=await main();const sm=SYMP.filter(x=>!sy.includes(x));ok('symptômes : doses',sm.length===0||sm);noOld('symptômes',sy);
 ok('symptômes : zinc sans dose chiffrée',!/Zinc[^.]*\d+ ?mg/.test(sy)||sy.match(/Zinc[^.]*\d+ ?mg/)[0]);
 await clk('Recettes');await hide();{const h=p.locator('#prep-sinus button');if(await h.getAttribute('aria-expanded')!=='true')await h.click();await p.waitForTimeout(300);}const rc=await main();ok('recettes : sinus jusqu’à 6 fois',rc.includes('Jusqu’à 6 fois par jour les 2 premiers jours, puis 1 à 3 fois par jour selon l’intensité.'));
 ok('recettes : La plus forte inchangée (½ c. à café de peroxyde)',rc.includes('½ c. à café de peroxyde d’hydrogène 3 % Food Grade (jamais le 35 %)')&&rc.includes('¼ c. à café de peroxyde 3 % Food Grade'));noOld('recettes',rc);
 // Accueil, Mode Soutien
 await clk('Accueil');await clk('Mode Soutien');await hide();await openAll();
 let ac=await main();
 ok('accueil soutien : protocole du jour vitamine D',ac.includes('Adulte : 1 000 à 2 000 UI tous les jours (pas de grosses doses espacées), plafond 4 000 UI. En phase aiguë : zinc en pastilles et vitamine C 2 g par jour (voir les fiches).'));
 ok('accueil soutien : section vitamine D',ac.includes('Dose courante chez l’adulte : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour.'));
 ok('accueil : gorge peroxyde 30 s + 30 s',ac.includes('30 s en bouche + 30 s en gorge, 3 fois par jour, jusqu’à 5 jours. Recracher, ne jamais avaler.'));
 await clk('Premiers signes');ac=await main();ok('phase premiers signes : zinc sans chiffre',ac.includes('Zinc en pastilles dans les 24 heures des premiers symptômes (adulte : voir la fiche Zinc).')&&ac.includes('Vitamine C en 2 à 3 prises dans la journée'));
 await clk('Convalescence');ac=await main();ok('phase convalescence : échinacée jusqu’à 10 jours',ac.includes('Échinacée : jusqu’à 10 jours.'));
 noOld('accueil soutien',ac);
 ok('nuit : double couverture, bas, bonnet gardés',(await main()).includes('Double couverture, bas, bonnet'));
 // Mode Combat : renfort zinc avec Avertissement
 await clk('Accueil');await clk('Mode Combat');await hide();
 const zc=p.locator('[data-clr=zinc-combat]');ok('combat : carte zinc visible',await zc.isVisible());
 const zt=NB(await zc.innerText());ok('combat : dose zinc des études',zt.includes(ZDOSE)||zt);
 ok('combat : Avertissement zinc complet',ZAV.every(x=>zt.includes(x))&&zt.includes('AVERTISSEMENT')||zt);
 ok('combat : zinc → Références',await zc.locator('[data-ref-link=zinc]').count()===1);
 const cb=await main();
 ok('combat : logique vitamine C 2 g',cb.includes('5. Double dose de vitamine C. Dès les premiers symptômes, doubler la dose : 2 g par jour, en 2 à 3 prises, pendant la durée du rhume ou de la grippe.'));
 ok('combat : logique peroxyde 30 s + 30 s',cb.includes('en gargarisme : 30 s en bouche + 30 s en gorge, 3 fois par jour, jusqu’à 5 jours. Recracher, ne pas avaler.'));
 ok('combat : logique miel inchangée',cb.includes('4. Miel cru. Miel seul : 1 c. à soupe, cuillère pas en métal. Ne pas boire juste après : laisser agir.'));
 ok('combat : cinq gestes (zinc en renfort, pas un 6e geste)',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5);
 noOld('combat',cb);
 if(dn==='iphone13'){const st=await p.addStyleTag({content:'header,nav.fixed,[data-clr=install]{visibility:hidden!important}'});await zc.evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-12));await p.waitForTimeout(250);await p.screenshot({path:S+'doses-zinc.png'});await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));}
 await clk('J’ai mal à la gorge, je commence');
 const gv=NB(await p.locator('[data-clr=protocole] [data-geste=vitamine-c-double]').innerText());ok('checklist vitamine C : 2 à 3 fois, 2 g',gv.includes('1 prise avec de l’eau, 2 à 3 fois par jour (2 g par jour au total)')||gv);
 const gp=NB(await p.locator('[data-clr=protocole] [data-geste=peroxyde]').innerText());ok('checklist peroxyde : 30 s + 30 s',gp.includes('30 s en bouche + 30 s en gorge, recracher, ne pas avaler')||gp);
 await clk('Intervalles et rappels');const st=NB(await p.locator('.clr-settings').innerText());ok('réglages : indications',st.includes('Doubler la dose : 2 g par jour (1 g → 2 g), en 2 à 3 prises. Au-delà de 2 g : risque de diarrhée et de calculs rénaux.')&&st.includes('3 fois par jour, jusqu’à 5 jours.')&&st.includes('La nuit : 30 min avant le coucher.')||st);
 noOld('protocole',await main());
 // Profil Enfant : zinc des études caché
 await clk('Enfant');await p.waitForTimeout(300);await openAll();
 ok('enfant : carte zinc Combat cachée',await p.locator('[data-clr=zinc-combat]').count()===0);
 const me=NB(await p.locator('#remede-miel').innerText());ok('enfant : miel 1-5 ans 2 c. à thé, jamais avant 1 an',me.includes('De 1 à 5 ans : 2 c. à thé')&&me.includes('Jamais avant 1 an')||me);
 await clk('Annuler le protocole');await clk('Oui, annuler et effacer');
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Remèdes');await hide();
 const fz=p.locator('#remede-zinc');if(await fz.count()){const bt=fz.locator('button[aria-expanded=false]');if(await bt.count())await bt.first().click();await p.waitForTimeout(200);}
 const ze=(await fz.count())?NB(await fz.innerText()):'';
 ok('enfant : fiche zinc sans la dose des études ni Avertissement adulte',!!ze&&!ze.includes('13 mg')&&!ze.includes('75 à 90 mg')&&!/Adulte :/.test(ze)&&await fz.locator('[data-clr=zinc-avertissement]').count()===0&&ze.includes('Pas la dose des études (réservée à l’adulte)')&&ze.includes('Jamais de zinc dans le nez')||ze);
 await clk('Adulte');await p.waitForTimeout(200);
 // Références : boîtes Sécurité
 await clk('Accueil');await p.locator('[data-clr=accueil-references-btn]').click();await p.waitForTimeout(600);
 const sec=async g=>NB(await p.locator(`[data-securite="${g}"]`).innerText());
 ok('Sécurité zinc',(await sec('zinc')).includes('Cette dose dépasse la limite usuelle de 40 mg par jour')&&(await sec('zinc')).includes('Jamais plus de 100 mg par jour')&&(await sec('zinc')).includes('Jamais de zinc dans le nez'));
 ok('Sécurité vitamine C',(await sec('vitamine-c')).includes('Au-delà de 2 g par jour : risque de diarrhée et de calculs rénaux.'));
 ok('Sécurité vitamine D',(await sec('vitamine-d')).includes('Plafond : 4 000 UI par jour.'));
 ok('Sécurité miel',(await sec('miel')).includes('jamais avant 1 an. De 1 à 5 ans : 2 c. à thé'));
 noOld('références',await main());
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
