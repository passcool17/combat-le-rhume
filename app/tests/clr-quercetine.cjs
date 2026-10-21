// Quercétine (branche quercetine) : fiche adulte seulement (cachée en profil Enfant), 500 mg 2 fois par jour avec le zinc,
// encadré Sécurité (Santé Canada, NatMed, MSKCC), renfort optionnel en Combat, prévention Soutien, Kit, Références « Quercétine » ;
// ligne cuivre du zinc alignée sur la liste du NIH ODS.
// usage : node tests/clr-quercetine.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ');
const N5=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-quercetine-final.json','utf8'));
const HOW='Dose des études : 500 mg de quercétine, 2 fois par jour avec un repas (1 000 mg par jour), en même temps que les pastilles de zinc, pendant 5 à 7 jours. Adulte seulement.';
const ZN='Avec le zinc : la quercétine aide le zinc à entrer dans les cellules (démontré en laboratoire).';
const EXTRA=[ZN,'Souvent vendue avec de la vitamine C et de la bromélaïne, qui aident son absorption. La forme phytosome est jusqu’à 20 fois mieux absorbée.','En prévention (hiver, efforts intenses) : même dose, jusqu’à 12 semaines.','Aliments riches en quercétine : oignons, pommes, thé noir ou vert, agrumes, raisins rouges, cerises, framboises.'];
const SEC=['Pas plus de 600 mg par prise ni 1 200 mg par jour, avec un repas. Au-delà de 12 semaines, demande avis (Santé Canada).','Pas si tu as un problème de reins : la quercétine pourrait l’aggraver.','Peut interagir avec certains antibiotiques (quinolones), la cyclosporine, les anticoagulants comme la warfarine et d’autres médicaments. Si tu prends des médicaments, demande au pharmacien.','Adulte seulement (dose établie pour 18 ans et plus). Pas pendant la grossesse ni l’allaitement.'];
const PREV='Quercétine, en prévention (adulte) : 500 mg 2 fois par jour avec un repas en hiver ou pendant les efforts intenses, jusqu’à 12 semaines.';
const PIL='Zinc et vitamine C pendant la maladie, avec la quercétine (500 mg 2 fois par jour, adulte), mélange ail-vinaigre-miel.';
const KITQ='Optionnel (adulte) : quercétine 500 mg, avec numéro NPN, à prendre avec le zinc';
const ZCU='Cure courte (5 à 7 jours) : le zinc à forte dose bloque l’absorption du cuivre seulement s’il est pris pendant des semaines. Ensuite, mange des aliments riches en cuivre (fruits de mer, graines et noix, abats, céréales de son, grains entiers et chocolat).';
const LBL={'@drdenwalker':'MD non vérifié','@Pharm_Obi':'Pharmacien, pas médecin'};
const OFF=N5.sources.map(o=>o.url);
const BAD=/hydroxychloroquin|ivermectin|vaccin|Önal|biy-2104-16|Zelenko|shedding/i;
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const rd=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
  ok('sources : enfant « À éviter chez l’enfant. »',rd('src/data/contenu.js').includes('quercetine: `À éviter chez l’enfant.`'));
  ok('sources : ancienne liste cuivre absente',!/noix, graines, cacao, fruits de mer, légumineuses/.test(rd('src/data/contenu.js')+rd('src/data/references.js')));
  const dist=path.join(__dirname,'..','..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  ok('site publié : fiche quercétine + ligne cuivre ODS',NB(js).includes(HOW)&&NB(js).includes(ZCU));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const main=async()=>NB(await p.locator('main').innerText());
 const shotAt=async(loc,file)=>{await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(250);await p.screenshot({path:S+file});};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 await clk('Remèdes');await hide();await openAll();
 const card=p.locator('#remede-quercetine');ok('fiche quercétine présente',await card.count()===1);
 const ct=NB(await card.innerText());
 ok('fiche : dose 500 mg 2 fois par jour avec le zinc, 5 à 7 jours',ct.includes(HOW)||ct);
 ok('fiche : zinc dans les cellules, absorption, prévention, aliments',EXTRA.every(x=>ct.includes(x))||ct);
 ok('fiche : kicker + étiquette',ct.toUpperCase().includes('AVEC LE ZINC · ADULTE')&&ct.includes('Avec le zinc · adulte')||ct);
 const sc=(await card.locator('[data-clr=quercetine-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité (4 lignes exactes)',JSON.stringify(sc)===JSON.stringify(SEC)||sc);
 ok('fiche : Sécurité étiquetée',(await card.locator('[data-clr=quercetine-securite]').getAttribute('aria-label'))==='Sécurité : quercétine');
 ok('fiche : lien Références Quercétine (16)',(await card.locator('[data-ref-link=quercetine]').innerText()).includes('Quercétine (16)'));
 ok('fiche zinc : ligne cuivre (liste NIH ODS)',NB(await p.locator('#remede-zinc [data-clr=zinc-cuivre]').innerText()).includes(ZCU));
 if(dn==='iphone13'){const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await shotAt(card,'quercetine-fiche.png');await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));}
 for(const f of ['Fièvre','Gorge','Prudence']){await clk(f);ok('filtre '+f+' : fiche quercétine',await p.locator('#remede-quercetine').count()===1);}
 await clk('Toux');ok('filtre Toux : pas de fiche quercétine',await p.locator('#remede-quercetine').count()===0);await clk('Tous');
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('quercétine');await p.waitForTimeout(300);ok('recherche : quercétine',await p.locator('#remede-quercetine').count()===1);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 // Soutien : piliers + prévention adulte
 await clk('Accueil');await clk('Mode Soutien');await hide();await openAll();const so=await main();
 ok('soutien : pilier Soutien ciblé avec la quercétine',so.includes(PIL));
 ok('soutien : prévention quercétine (adulte), oreilles en dernier',so.includes(PREV));
 await clk('Conseils');await openAll();ok('conseils : prévention quercétine',(await main()).includes(PREV));
 // Combat : renfort optionnel avec le zinc, kit, cinq gestes inchangés
 await clk('Accueil');await clk('Mode Combat');await hide();
 const qc=p.locator('[data-clr=quercetine-combat]');ok('combat : renfort quercétine visible',await qc.isVisible());
 const qt=NB(await qc.innerText());ok('combat : renfort optionnel avec le zinc, dose, Sécurité',qt.toUpperCase().includes('RENFORT OPTIONNEL · AVEC LE ZINC')&&qt.includes(HOW)&&qt.includes(ZN)&&qt.includes('Optionnel : ne remplace pas les cinq gestes. Adulte seulement.')&&SEC.every(x=>qt.includes(x))||qt);
 ok('combat : renfort juste après le zinc',await p.locator('[data-clr=panel] > *').evaluateAll(cs=>{const i=cs.findIndex(c=>c.dataset.clr==='zinc-combat');return i>=0&&cs[i+1]?.dataset.clr==='quercetine-combat';}));
 ok('combat : ligne cuivre ODS dans la carte zinc',NB(await p.locator('[data-clr=zinc-combat] [data-clr=zinc-cuivre]').innerText()).includes(ZCU));
 ok('combat : cinq gestes (quercétine en renfort, pas un 6e geste)',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5);
 const kt=NB(await p.locator('[data-clr=kit]').innerText());ok('kit : quercétine optionnelle (15 éléments)',kt.includes(KITQ)&&kt.includes('0 / 15')||kt);
 await qc.locator('[data-ref-link=quercetine]').click();await p.waitForTimeout(600);
 const top=await p.locator('#ref-quercetine').evaluate(e=>e.getBoundingClientRect().top);ok('combat : renfort → Références Quercétine',(await p.locator('main h1').first().innerText())==='Références'&&top>=0&&top<400||top);
 // Références
 ok('références : groupe Quercétine (6 X + 10 études)',(await p.locator('#ref-quercetine-t').innerText())==='Quercétine'&&await p.locator('#ref-quercetine [data-ref]').count()===6&&await p.locator('#ref-quercetine [data-etude]').count()===10);
 const rs=await p.locator('#ref-quercetine [data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,t:l.innerText})));
 ok('références : 6 publications X, citations, étiquettes honnêtes',rs.length===6&&rs.every(r=>{const x=N5.posts.find(y=>y.n===r.n);return x&&r.h===x.url&&r.lb===(LBL[x.handle]??null)&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist));})||rs.map(r=>[r.n,r.lb]));
 ok('références : rien sur HCQ, ivermectine, vaccins, Önal 2021',!BAD.test(NB(await p.locator('#ref-quercetine').innerText())));
 const es=await p.locator('#ref-quercetine [data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href'),pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
 ok('références : 10 études, DOI + PubMed + résumé + niveau',es.length===10&&N5.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>e.n));
 ok('références : Nieman 2007 appuie directement',es.find(e=>e.t.includes('Nieman DC'))?.b==='direct');
 const sx=(await p.locator('[data-securite=quercetine] li').allInnerTexts()).map(NB);ok('références : Sécurité quercétine',JSON.stringify(sx)===JSON.stringify(N5.nuances.map(NB))||sx);
 const of=await p.locator('[data-securite=quercetine] [data-clr=sources-officielles] a').evaluateAll(as=>as.map(a=>[a.getAttribute('href'),a.target,a.rel]));
 ok('références : 3 sources officielles, nouvel onglet',JSON.stringify(of.map(x=>x[0]))===JSON.stringify(OFF)&&of.every(x=>x[1]==='_blank'&&x[2].includes('noopener'))||of);
 ok('références : sommaire Quercétine (16)',(await p.locator('[data-otp]').textContent()).includes('Quercétine (16)'));
 if(dn==='iphone13'){await shotAt(p.locator('#ref-quercetine'),'quercetine-refs.png');}
 // Profil Enfant : tout est caché
 await clk('Accueil');await clk('Mode Combat');await hide();await clk('Enfant');await p.waitForTimeout(300);
 ok('enfant : renfort Combat caché',await p.locator('[data-clr=quercetine-combat]').count()===0);
 ok('enfant : kit sans quercétine (11 éléments)',!/quercétine/i.test(await p.locator('[data-clr=kit]').innerText())&&(await p.locator('[data-clr=kit]').innerText()).includes('0 / 11'));
 await clk('Accueil');await clk('Mode Soutien');await hide();await openAll();
 ok('enfant : pas de prévention quercétine',!(await main()).includes(PREV));
 await clk('Remèdes');await hide();
 ok('enfant : fiche quercétine cachée',await p.locator('#remede-quercetine').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('quercétine');await p.waitForTimeout(300);ok('enfant : recherche quercétine vide',await p.locator('#remede-quercetine').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 await clk('Adulte');await p.waitForTimeout(200);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
