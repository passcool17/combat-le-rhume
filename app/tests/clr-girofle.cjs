// Clou de girofle (branche girofle) : fiche adulte seulement (cachée en profil Enfant), filtre Gorge,
// mâcher 1 à 2 clous, gargarisme, infusion, bain de bouche 1 à 5 % (EMA), encadré Sécurité (huile essentielle, enfants,
// anticoagulants, foie), renfort optionnel en Combat (miel seul inchangé), Kit, Références « Clou de girofle ».
// usage : node tests/clr-girofle.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ');
const N6=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-girofle-final.json','utf8'));
const HOW='Mal de gorge : mâcher lentement 1 à 2 clous de girofle entiers, plusieurs fois par jour, puis les recracher. Adulte seulement.';
const GAR='Gargarisme : eau infusée de clous de girofle, tiède, plusieurs fois par jour, puis recracher.';
const EXTRA=[GAR,'Infusion : 2 c. à thé de clous de girofle dans 2 tasses d’eau chaude, 10 minutes, puis filtrer.','Bain de bouche du commerce à l’huile essentielle de girofle (1 à 5 %) : plusieurs fois par jour, 1 semaine maximum (Agence européenne du médicament).','Son eugénol engourdit la douleur dans la bouche aussi bien qu’un gel de benzocaïne, et freine en laboratoire le virus de la grippe A et un coronavirus du rhume.'];
const SEC=['Huile essentielle : jamais pure dans la bouche, jamais avalée. Avalée, même en petite quantité, elle peut causer de graves atteintes du foie, des convulsions ou un coma (MedlinePlus).','Garde l’huile hors de portée des enfants. Produits à l’huile de girofle : pas avant 18 ans (Agence européenne du médicament).','Pas si tu prends un anticoagulant ou de l’acétaminophène, ni en cas de maladie du foie (Santé Canada).','Pas pendant la grossesse ni l’allaitement. Pas si tu es allergique au baume du Pérou.','Recrache le clou après l’avoir mâché : avalé de travers, il peut se coincer dans les voies respiratoires.'];
const KITG='Optionnel (adulte) : clous de girofle entiers, à mâcher ou en infusion pour la gorge';
const MIEL='Pour le mal de gorge, prendre seulement du miel : 1 cuillère à soupe de miel seul, avec une cuillère qui n’est pas en métal (bois, plastique ou céramique). Pas dans une tisane, pas de citron.';
const LBL={'@zizelle_':'Pharmacienne, pas médecin','@dravinash23':'Praticien ayurvédique, pas médecin','@drkmhpvtltd':'Hôpital, pas un médecin','@drjoshaxe':'Chiropraticien, pas médecin'};
const OFF=N6.sources.map(o=>o.url);
const BAD=/hydroxychloroquin|ivermectin|vaccin|cigarette|Barbara O/i;
// Les références internationales (clr-international) s’ajoutent aux thèmes : les vérifications du groupe portent sur les éléments non internationaux ([data-intl] exclus) ; les totaux affichés les comptent.
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const rd=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
  ok('sources : enfant « À éviter chez l’enfant »',rd('src/data/contenu.js').includes('girofle: `À éviter chez l’enfant. L’huile essentielle de girofle avalée est très toxique : toujours hors de portée.`'));
  ok('sources : miel seul inchangé',rd('src/data/contenu.js').includes(MIEL));
  const dist=path.join(__dirname,'..','..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  ok('site publié : fiche clou de girofle',NB(js).includes(HOW)&&SEC.every(x=>NB(js).includes(x)));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const shotAt=async(loc,file)=>{await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(250);await p.screenshot({path:S+file});};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 await clk('Remèdes');await hide();await openAll();
 const card=p.locator('#remede-girofle');ok('fiche clou de girofle présente',await card.count()===1);
 const ct=NB(await card.innerText());
 ok('fiche : mâcher 1 à 2 clous, plusieurs fois par jour, recracher',ct.includes(HOW)||ct);
 ok('fiche : gargarisme, infusion, bain de bouche 1 à 5 % (EMA), eugénol',EXTRA.every(x=>ct.includes(x))||ct);
 ok('fiche : kicker + étiquette',ct.toUpperCase().includes('GORGE · ADULTE')&&ct.includes('Gorge · eugénol')||ct);
 ok('fiche : titre',(await card.locator('h2,h3').first().innerText()).includes('Clou de girofle'));
 const sc=(await card.locator('[data-clr=girofle-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité (5 lignes exactes)',JSON.stringify(sc)===JSON.stringify(SEC)||sc);
 ok('fiche : Sécurité étiquetée',(await card.locator('[data-clr=girofle-securite]').getAttribute('aria-label'))==='Sécurité : clou de girofle');
 ok('fiche : lien Références Clou de girofle (18 avec 1 étude internationale)',(await card.locator('[data-ref-link=girofle]').innerText()).includes('Clou de girofle (18)'));
 ok('fiche miel seul inchangée',NB(await p.locator('#remede-miel').innerText()).includes(MIEL));
 if(dn==='iphone13'){const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await shotAt(card,'girofle-fiche.png');await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));}
 for(const f of ['Gorge','Prudence']){await clk(f);ok('filtre '+f+' : fiche clou de girofle',await p.locator('#remede-girofle').count()===1);}
 for(const f of ['Toux','Fièvre']){await clk(f);ok('filtre '+f+' : pas de fiche clou de girofle',await p.locator('#remede-girofle').count()===0);}
 await clk('Tous');
 for(const q of ['girofle','eugénol']){await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill(q);await p.waitForTimeout(300);ok('recherche : '+q,await p.locator('#remede-girofle').count()===1);}
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 // Combat : renfort optionnel gorge, kit, cinq gestes et miel seul inchangés
 await clk('Accueil');await clk('Mode Combat');await hide();
 const gc=p.locator('[data-clr=girofle-combat]');ok('combat : renfort clou de girofle visible',await gc.isVisible());
 const gt=NB(await gc.innerText());ok('combat : renfort optionnel gorge, dose, gargarisme, Sécurité',gt.toUpperCase().includes('RENFORT OPTIONNEL · GORGE')&&gt.includes(HOW)&&gt.includes(GAR)&&gt.includes('Optionnel : ne remplace pas les cinq gestes. Adulte seulement.')&&SEC.every(x=>gt.includes(x))||gt);
 ok('combat : renfort juste après l’argent colloïdal',await p.locator('[data-clr=panel] > *').evaluateAll(cs=>{const i=cs.findIndex(c=>c.dataset.clr==='argent-combat');return i>=0&&cs[i+1]?.dataset.clr==='girofle-combat';}));
 ok('combat : cinq gestes (clou de girofle en renfort, pas un 6e geste)',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5);
 ok('combat : pas de girofle dans les gestes',!/girofle/i.test(await p.locator('main').evaluate(m=>[...m.querySelectorAll('h2')].filter(h=>/Miel seul|Spray Betadine|Pastilles antiseptiques/.test(h.textContent)).map(h=>h.closest('section,article,div').innerText).join(' '))));
 const kt=NB(await p.locator('[data-clr=kit]').innerText());ok('kit : clou de girofle optionnel (18 éléments, avec la NAC, l’astragale, les vitamines B et la K2)',kt.includes(KITG)&&kt.includes('0 / 18')||kt);
 await gc.locator('[data-ref-link=girofle]').click();await p.waitForTimeout(600);
 const top=await p.locator('#ref-girofle').evaluate(e=>e.getBoundingClientRect().top);ok('combat : renfort → Références Clou de girofle',(await p.locator('main h1').first().innerText())==='Références'&&top>=0&&top<400||top);
 // Références
 ok('références : groupe Clou de girofle (6 X + 11 études)',(await p.locator('#ref-girofle-t').innerText())==='Clou de girofle'&&await p.locator('#ref-girofle [data-ref]:not([data-intl])').count()===6&&await p.locator('#ref-girofle [data-etude]:not([data-intl])').count()===11);
 const rs=await p.locator('#ref-girofle [data-ref]:not([data-intl])').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,t:l.innerText})));
 ok('références : 6 publications X, citations, étiquettes honnêtes',rs.length===6&&rs.every(r=>{const x=N6.posts.find(y=>y.n===r.n);return x&&r.h===x.url&&r.lb===(LBL[x.handle]??null)&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist));})||rs.map(r=>[r.n,r.lb]));
 ok('références : Alvina Jalil appuie directement (mal de gorge)',(await p.locator('#ref-girofle [data-ref]:not([data-intl])').filter({hasText:'Alvina Jalil'}).locator('[data-badge]').getAttribute('data-badge'))==='direct');
 ok('références : rien sur HCQ, ivermectine, vaccins, cigarettes',!BAD.test(NB(await p.locator('#ref-girofle').innerText())));
 const es=await p.locator('#ref-girofle [data-etude]:not([data-intl])').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href'),pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
 ok('références : 11 études, DOI + PubMed + résumé + niveau',es.length===11&&N6.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>e.n));
 ok('références : grippe A (Dai 2013) et coronavirus 229E',es.some(e=>e.t.includes('Dai JP')&&e.t.includes('grippe A'))&&es.some(e=>e.t.includes('229E')));
 const sx=(await p.locator('[data-securite=girofle] li').allInnerTexts()).map(NB);ok('références : Sécurité clou de girofle',JSON.stringify(sx)===JSON.stringify(N6.nuances.map(NB))||sx);
 const of=await p.locator('[data-securite=girofle] [data-clr=sources-officielles] a').evaluateAll(as=>as.map(a=>[a.getAttribute('href'),a.target,a.rel]));
 ok('références : 4 sources officielles (EMA, Santé Canada ×2, MedlinePlus), nouvel onglet',of.length===4&&JSON.stringify(of.map(x=>x[0]))===JSON.stringify(OFF)&&of.every(x=>x[1]==='_blank'&&x[2].includes('noopener'))||of);
 ok('références : sommaire Clou de girofle (18)',(await p.locator('[data-otp]').textContent()).includes('Clou de girofle (18)'));
 if(dn==='iphone13'){await shotAt(p.locator('#ref-girofle'),'girofle-refs.png');}
 // Profil Enfant : tout est caché
 await clk('Accueil');await clk('Mode Combat');await hide();await clk('Enfant');await p.waitForTimeout(300);
 ok('enfant : renfort Combat caché',await p.locator('[data-clr=girofle-combat]').count()===0);
 ok('enfant : kit sans clou de girofle (11 éléments)',!/girofle/i.test(await p.locator('[data-clr=kit]').innerText())&&(await p.locator('[data-clr=kit]').innerText()).includes('0 / 11'));
 await clk('Accueil');await clk('Mode Soutien');await hide();
 await clk('Remèdes');await hide();
 ok('enfant : fiche clou de girofle cachée',await p.locator('#remede-girofle').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('girofle');await p.waitForTimeout(300);ok('enfant : recherche girofle vide',await p.locator('#remede-girofle').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 await clk('Adulte');await p.waitForTimeout(200);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
