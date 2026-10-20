// Argent colloïdal (branche argent-colloidal) : fiche gargarisme/nez ~15 ppm, jamais avalé, adulte seulement (cachée en profil Enfant),
// encadré Sécurité, renfort optionnel en Combat, Kit, Références « Argent colloïdal », et titre « Combat le rhume et la grippe ».
// usage : node tests/clr-argent.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ');
const N3=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-argent-final.json','utf8'));
const T='Combat le rhume et la grippe';
const HOW='Gargarisme : argent colloïdal à environ 15 ppm, 15 à 30 secondes, puis recracher. Jusqu’à 3 fois par jour. Ne jamais avaler.';
const NEZ='Nez : rinçage ou vaporisation à environ 15 ppm, 2 fois par jour, jusqu’à 10 jours. Ne jamais avaler.';
const SEC=['Pas par la bouche : avalé de façon prolongée, l’argent s’accumule et colore la peau en bleu-gris, de façon permanente (argyrie).','Choisir un produit avec un numéro NPN ou DIN à 8 chiffres : Santé Canada a rappelé des produits non autorisés.','Peut nuire à l’absorption de certains antibiotiques et de la thyroxine. Si tu prends des médicaments, demande au pharmacien.','Jamais pour les enfants, ni pendant la grossesse ou l’allaitement.'];
const PIL='Argent colloïdal : en gargarisme ou dans le nez seulement (environ 15 ppm, adulte), jamais avalé.';
const AVT='L’argent colloïdal : en gargarisme ou dans le nez seulement, chez l’adulte, jamais avalé (pris par la bouche, il peut causer une argyrie : mise en garde de Santé Canada).';
const OFF=['https://recalls-rappels.canada.ca/en/alert-recall/unauthorized-panasilver-product-children-and-adults-may-pose-serious-health-risk','https://recalls-rappels.canada.ca/en/alert-recall/unauthorized-colloidal-solutions-colloidal-metal-health-products-recalled-because-they','https://www.nccih.nih.gov/health/colloidal-silver','https://www.govinfo.gov/content/pkg/FR-1999-08-17/pdf/99-21253.pdf','https://www.mayoclinic.org/healthy-lifestyle/consumer-health/expert-answers/colloidal-silver/faq-20058061'];
const LBL={94:'MD non vérifié',95:'Anonyme, MD non vérifié',96:'Chiropraticien, pas médecin',97:'Infirmière (RN), pas médecin'};
const OLDTXT=/Non recommandé par voie interne|non recommandé par voie interne|n’est pas recommandé par voie interne|Mise en garde Santé Canada/;
const BAD=/chlorine|dioxyde de chlore|\bCDS\b|vaccin|swallowed|teaspoon|40767401|s40463-017-0241-z|Scott JR/i;
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const rd=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
  const src=['src/data/contenu.js','src/pages/Accueil.jsx','src/combat/CombatPlus.jsx','src/pages/Remedes.jsx'].map(rd).join('\n');
  ok('sources : plus de « non recommandé par voie interne »',!OLDTXT.test(src));
  ok('sources : enfant « À éviter chez l’enfant. »',rd('src/data/contenu.js').includes('argent: `À éviter chez l’enfant.`'));
  const refs=rd('src/data/references.js');ok('références : Scott 2017 absent, pas de dioxyde de chlore',!/s40463-017-0241-z|Scott JR|chlorine/i.test(refs));
  const dist=path.join(__dirname,'..','..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  ok('site publié : nouvelle fiche, ancienne mise en garde absente',NB(js).includes(HOW)&&!OLDTXT.test(js));
  const ih=fs.readFileSync(path.join(__dirname,'..','..','index.html'),'utf8');
  ok('index.html : <title>, description, og, apple',ih.includes(`<title>${T} — guide pratique</title>`)&&ih.includes('<meta name="description" content="Guide pratique contre le rhume et la grippe')&&ih.includes(`<meta property="og:title" content="${T}" />`)&&ih.includes('"name":"'+T+'"')&&ih.includes('content="Rhume et grippe"'));
  const mf=JSON.parse(fs.readFileSync(path.join(__dirname,'..','..','manifest.webmanifest'),'utf8'));
  ok('manifest : name + short_name, URL inchangée',mf.name===T&&mf.short_name==='Rhume et grippe'&&mf.start_url==='/combat-le-rhume/'&&mf.description.startsWith('Guide pratique contre le rhume et la grippe'));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const main=async()=>NB(await p.locator('main').innerText());
 const shotAt=async(loc,file)=>{await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(250);await p.screenshot({path:S+file});};
 await p.goto(url,{waitUntil:'networkidle'});await hide();
 ok('titre de la page',(await p.title())===`${T} — guide pratique`);
 ok('en-tête : Combat le rhume et la grippe',NB(await p.locator('header').innerText()).includes(T));
 ok('accueil : h1 Combat le rhume et la grippe, en bref',(await p.locator('main h1').first().innerText())===`${T}, en bref`);
 ok('accueil : carte Combat rhume ou grippe',(await main()).includes('Rhume ou grippe, dès le premier mal de gorge : cinq gestes'));
 if(dn==='iphone13'){await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(200);await p.screenshot({path:S+'titre-grippe.png'});}
 await clk('Lire la suite');ok('Avertissement : argent cohérent',(await main()).includes(AVT)&&!OLDTXT.test(await main()));
 await clk('Commencer');await hide();
 // Liste complète, Adulte
 await clk('Remèdes');await hide();ok('titre vue Remèdes',(await p.title())===`Remèdes · ${T}`);
 await openAll();
 const card=p.locator('#remede-argent');const ct=NB(await card.innerText());
 ok('fiche : gargarisme 15 ppm, recracher, 3 fois',ct.includes(HOW)||ct);
 ok('fiche : nez 2 fois par jour, 10 jours',ct.includes(NEZ)&&ct.includes('Adulte seulement.')||ct);
 ok('fiche : kicker + étiquette',ct.toUpperCase().includes('GORGE ET NEZ · ADULTE')&&ct.includes('Gargarisme · nez · ne jamais avaler')||ct);
 const sc=(await card.locator('[data-clr=argent-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité (4 lignes exactes)',JSON.stringify(sc)===JSON.stringify(SEC)||sc);
 ok('fiche : titre Sécurité',NB(await card.locator('[data-clr=argent-securite]').innerText()).toUpperCase().startsWith('SÉCURITÉ'));
 ok('fiche : plus de « non recommandé »',!OLDTXT.test(ct)&&!/Mise en garde/.test(ct));
 ok('fiche : lien Références Argent colloïdal (14)',(await card.locator('[data-ref-link=argent]').innerText()).includes('Argent colloïdal (14)'));
 if(dn==='iphone13'){const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await shotAt(card,'argent-fiche.png');await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));}
 for(const f of ['Gorge','Congestion','Prudence']){await clk(f);ok('filtre '+f+' : fiche argent',await p.locator('#remede-argent').count()===1);}
 await clk('Toux');ok('filtre Toux : pas de fiche argent',await p.locator('#remede-argent').count()===0);await clk('Tous');
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('argent');await p.waitForTimeout(300);ok('recherche : argent',await p.locator('#remede-argent').count()===1);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 // Mode Soutien
 await clk('Accueil');await clk('Mode Soutien');await hide();await openAll();const so=await main();
 ok('soutien : piliers cohérents',so.includes(PIL)&&!OLDTXT.test(so));
 ok('soutien : intro rhume et grippe',so.includes('Les soins naturels aident ton système à se défendre contre le rhume et la grippe.'));
 await clk('Remèdes');await hide();ok('soutien remèdes : intro',(await main()).includes('Renforts, ravitaillement et récupération contre le rhume et la grippe'));
 ok('soutien remèdes : fiche argent',await p.locator('#remede-argent').count()===1);
 // Mode Combat : renfort optionnel + kit, cinq gestes inchangés
 await clk('Accueil');await clk('Mode Combat');await hide();
 const ac=p.locator('[data-clr=argent-combat]');ok('combat : renfort argent visible',await ac.isVisible());
 const at=NB(await ac.innerText());ok('combat : renfort optionnel, doses, Sécurité',at.toUpperCase().includes('RENFORT OPTIONNEL · GORGE ET NEZ')&&at.includes(HOW)&&at.includes(NEZ)&&at.includes('Optionnel : ne remplace pas les cinq gestes. Adulte seulement.')&&SEC.every(x=>at.includes(x))||at);
 ok('combat : cinq gestes (argent en renfort, pas un 6e geste)',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5&&!(await p.locator('#remede-argent').count()));
 const kt=NB(await p.locator('[data-clr=kit]').innerText());ok('kit : argent optionnel (13 éléments, avec la quercétine)',kt.includes('Optionnel (adulte) : argent colloïdal environ 15 ppm, avec numéro NPN ou DIN, pour le gargarisme ou le nez')&&kt.includes('0 / 13')||kt);
 await ac.locator('[data-ref-link=argent]').click();await p.waitForTimeout(600);
 const top=await p.locator('#ref-argent').evaluate(e=>e.getBoundingClientRect().top);ok('combat : renfort → Références Argent colloïdal',(await p.locator('main h1').first().innerText())==='Références'&&top>=0&&top<400||top);
 // Références
 ok('références : groupe Argent colloïdal',(await p.locator('#ref-argent-t').innerText())==='Argent colloïdal'&&await p.locator('#ref-argent [data-ref]').count()===4&&await p.locator('#ref-argent [data-etude]').count()===10);
 const rs=await p.locator('#ref-argent [data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent,t:l.innerText})));
 ok('références : 4 publications X, étiquettes honnêtes',rs.length===4&&rs.every(r=>{const x=N3.posts.find(y=>y.n===r.n);return x&&r.h===x.url&&r.lb===LBL[r.n]&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist));})||rs.map(r=>[r.n,r.lb]));
 ok('références : rien sur avaler, dioxyde de chlore, vaccin, Scott 2017',!BAD.test(NB(await p.locator('#ref-argent').innerText())));
 const es=await p.locator('#ref-argent [data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href'),pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
 ok('références : 10 études (8 + 2 grippe), DOI + PubMed + résumé',es.length===10&&N3.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>e.n));
 ok('références : Almanza-Reyes 2021 appuie directement',es.find(e=>e.t.includes('Almanza-Reyes'))?.b==='direct');
 const sx=(await p.locator('[data-securite=argent] li').allInnerTexts()).map(NB);ok('références : Sécurité argent',JSON.stringify(sx)===JSON.stringify(N3.nuances.map(NB))||sx);
 const of=await p.locator('[data-securite=argent] [data-clr=sources-officielles] a').evaluateAll(as=>as.map(a=>[a.getAttribute('href'),a.target,a.rel]));
 ok('références : 5 sources officielles, nouvel onglet',JSON.stringify(of.map(x=>x[0]))===JSON.stringify(OFF)&&of.every(x=>x[1]==='_blank'&&x[2].includes('noopener'))||of);
 ok('références : sommaire Argent colloïdal (14)',(await p.locator('[data-otp]').textContent()).includes('Argent colloïdal (14)'));
 if(dn==='iphone13'){await shotAt(p.locator('#ref-argent'),'argent-refs.png');}
 // Profil Enfant : tout est caché, la dose enfant reste « à éviter »
 await clk('Accueil');await clk('Mode Combat');await hide();await clk('Enfant');await p.waitForTimeout(300);
 ok('enfant : renfort Combat caché',await p.locator('[data-clr=argent-combat]').count()===0);
 ok('enfant : kit sans argent (11 éléments)',!/argent colloïdal/i.test(await p.locator('[data-clr=kit]').innerText())&&(await p.locator('[data-clr=kit]').innerText()).includes('0 / 11'));
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Remèdes');await hide();
 ok('enfant : fiche argent cachée',await p.locator('#remede-argent').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('argent');await p.waitForTimeout(300);ok('enfant : recherche argent vide',await p.locator('#remede-argent').count()===0);
 await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill('');
 await clk('Accueil');await openAll();ok('enfant : gorge sans argent colloïdal',(await main()).includes('Chez l’enfant : pas de peroxyde ni d’argent colloïdal, et pas de miel avant 1 an.'));
 await clk('Adulte');await p.waitForTimeout(200);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
