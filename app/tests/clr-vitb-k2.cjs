// Vitamines B et K2 (branche vitamines-b-k2) : fiche « Vitamines B (complexe B méthylé) » adulte seulement (cachée en Enfant,
// comme la NAC), doses B12/folate/B6, Sécurité 9 points ; K2 sur la fiche Vitamines C et D (adulte, Sécurité K2 6 points,
// cachées en Enfant) ; Kit Combat (18) ; prévention Soutien (adulte) ; Références : nouveau groupe « Vitamines B » (5 X + 11 études)
// et K2 dans « Vitamine D et K2 » (5 X + 5 études), drapeau + pays, traductions, étiquettes ; Florence Comite : MD partout ;
// nouveaux totaux.
// usage : node tests/clr-vitb-k2.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\u2011/g,'-').replace(/\s+/g,' ').trim();
const SRC=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-vitb-k2.json','utf8')).remedies;
const F=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-vitb-k2-final.json','utf8'));
const AST=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-astragale-final.json','utf8'));
const HOW='B12 (méthylcobalamine) : 250 à 1 000 µg par jour. Folate : 400 µg par jour (méthylfolate ou acide folique), jamais plus de 1 000 µg d’acide folique. B6 : 10 mg par jour au maximum au total, en additionnant tous les produits. Ou un complexe B méthylé avec un numéro NPN de Santé Canada. Adulte seulement.';
const SECB=['B6 et nerfs : à 10 mg par jour ou plus, risque d’atteinte des nerfs (engourdissements, picotements, douleur aux mains et aux pieds). Arrête et consulte si ces symptômes apparaissent (Santé Canada).','Folate et B12 : beaucoup d’acide folique (plus de 1 000 µg par jour) peut masquer un manque de B12 pendant que les nerfs s’abîment. Fais vérifier ta B12 avant de prendre beaucoup de folate.','Reins : de fortes doses de vitamines B (folate 2,5 mg, B6 25 mg, B12 1 mg) ont accéléré la baisse de la fonction rénale chez des diabétiques atteints de néphropathie (JAMA 2010). Problème de reins : demande l’avis du médecin.','Neuropathie optique de Leber : évite la cyanocobalamine (prends la méthylcobalamine).','Allergie au cobalt : attention, la B12 contient du cobalt.','Metformine et inhibiteurs de la pompe à protons (oméprazole, pantoprazole, etc.) : ils abaissent la B12. Parles-en au pharmacien.','Grossesse : 400 µg d’acide folique par jour sont recommandés avant et pendant la grossesse. Pas de fortes doses de B6 sans avis.','Enfants : doses adaptées à l’âge seulement (limites plus basses pour la B6), avec le pharmacien.','Phénytoïne ou méthotrexate : le folate peut baisser l’effet de la phénytoïne et interférer avec le méthotrexate. Parles-en au médecin.'];
const K2='Vitamine K2 avec la vitamine D (adulte) : 90 à 120 µg de MK-7 par jour, avec le repas où tu prends ta vitamine D, pour aider le calcium à aller dans les os plutôt que dans les artères. Au Canada, 120 µg par jour au maximum dans les produits de santé naturels ; il existe des produits D3 + K2.';
const SECK=['Warfarine ou autre antivitamine K (acénocoumarol) : pas de K2 sans l’accord du médecin. Même à petite dose (10 à 20 µg par jour), la MK-7 change l’effet de la warfarine (INR).','Autre anticoagulant (apixaban, rivaroxaban, dabigatran) : Santé Canada demande l’avis du médecin ou du pharmacien avant de prendre de la vitamine K, à toute dose.','Dialyse ou insuffisance rénale : parles-en au néphrologue avant (vitamine D, calcium et anticoagulants y sont souvent ajustés).','Grossesse et allaitement : pas de K2 en supplément, seulement dans les aliments, sauf avis médical.','Enfants : pas de K2 en supplément sans avis.','Garde la dose de vitamine D de l’appli (1 000 à 2 000 UI, plafond 4 000 UI) : la K2 ne permet pas de dépasser ce plafond.'];
const VITD=['Vitamine D : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour. Utile pour le système immunitaire.'];
const KITB='Optionnel (adulte) : complexe B méthylé avec numéro NPN (B6 : 10 mg par jour au maximum au total)';
const KITK='Optionnel (adulte) : vitamine K2 (MK-7) 90 à 120 µg, à prendre avec la vitamine D (pas avec la warfarine)';
const PREVB='Vitamines B, en prévention (adulte) : B12 250 à 1 000 µg et folate 400 µg par jour, B6 10 mg par jour au maximum au total, ou un complexe B méthylé avec un numéro NPN.';
const PREVK='Vitamine K2, avec la vitamine D (adulte) : 90 à 120 µg de MK-7 par jour, au repas où tu prends ta vitamine D.';
const MIEL='Pour le mal de gorge, prendre seulement du miel : 1 cuillère à soupe de miel seul, avec une cuillère qui n’est pas en métal (bois, plastique ou céramique). Pas dans une tisane, pas de citron.';
const LANG={en:'anglais',es:'espagnol'};
const BAD=/mitigé|contradi|nuanc|pas d.effet|aucun effet|non significati|incertain|preuves? (faible|insuffisant)|Cochrane|faible à modérée/i;
const TOT={posts:182,etudes:268,medecins:32,intl:122,langues:10,pays:26};
const PB=F.posts.filter(x=>x.group==='vitamines-b'),PK=F.posts.filter(x=>x.group==='vitamine-d'),EB=F.etudes.filter(x=>x.group==='vitamines-b'),EK=F.etudes.filter(x=>x.group==='vitamine-d');
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const app=process.env.APPDIR||path.join(__dirname,'..');const rd=f=>fs.readFileSync(path.join(app,f),'utf8');const c=rd('src/data/contenu.js');
  const allSrcPosts=[...SRC.vitaminesB.posts,...SRC.vitamineK2.posts],allSrcEt=[...SRC.vitaminesB.studies,...SRC.vitamineK2.studies];
  ok('JSON final : 10 publications (7 + 5, dont 2 citées pour B et K2 gardées une fois) + 16 études, toutes celles de la source',F.posts.length===10&&F.etudes.length===16&&new Set(F.posts.map(x=>x.url)).size===10&&allSrcPosts.every(p=>F.posts.some(x=>x.url===p.url))&&allSrcEt.every(e=>F.etudes.some(x=>x.pubmed===e.pubmed&&x.doiUrl===e.doiUrl)));
  ok('JSON final : 5 + 11 Vitamines B, 5 + 5 Vitamine D et K2',PB.length===5&&EB.length===11&&PK.length===5&&EK.length===5);
  ok('JSON final : drapeau + pays partout, langue + traduction pour chaque publication',[...F.posts,...F.etudes].every(x=>x.flag&&x.country)&&F.posts.every(p=>LANG[p.lang]&&p.quoteFr));
  ok('JSON final : rien de nuancé ni contradictoire (textes en français)',!BAD.test([...F.posts.map(p=>p.claim+' '+p.gist+' '+p.quoteFr+' '+p.supportNote),...F.etudes.map(e=>e.finding+' '+e.supportNote),...F.nuances['vitamines-b'],...F.nuances['vitamine-d']].join(' ')));
  ok('JSON final : Florence Comite MD partout (vitamines B, K2 et astragale), source du titre',[...F.posts,...AST.posts].filter(x=>x.handle==='@FlorenceComite').every(x=>!x.notPhysician&&x.notPhysicianLabel===null&&x.name==='Dr Florence Comite, MD'&&/comitemd\.com/.test(x.credential)&&/PubMed/.test(x.credential)&&/Yale/.test(x.credential))&&[...F.posts,...AST.posts].filter(x=>x.handle==='@FlorenceComite').length===8);
  ok('sources : miel seul inchangé',c.includes(MIEL));
  const dist=path.join(app,'..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  ok('site publié : fiche vitamines B, K2, Sécurité, prévention, kit',[HOW,...SECB,K2,...SECK,PREVB,PREVK,KITB,KITK].every(x=>NB(js).includes(x)));
  ok('site publié : plus aucun « MD non vérifié » pour Florence Comite',!/Florence Comite[^}]{0,400}MD non vérifié/.test(js));
  ok('pré-cache hors ligne : chaque fichier publié est dans sw.js',fs.readdirSync(dist).every(f=>fs.readFileSync(path.join(app,'..','sw.js'),'utf8').includes('/combat-le-rhume/assets/'+f)));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const axe=async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});const v=await p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+' '+v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')));return v.length===0||v;};
 const shotCard=async(loc,file)=>{const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}header{position:relative!important;top:auto!important}'});await loc.scrollIntoViewIfNeeded();await p.waitForTimeout(200);await loc.screenshot({path:S+file});await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));};
 const shotAt=async(loc,file)=>{const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(300);await p.screenshot({path:S+file});await st.evaluate(e=>e.remove());};
 const search=async q=>{await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill(q);await p.waitForTimeout(300);};
 const has=async()=>await p.locator('#remede-vitamines-b').count()===1;
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 const ac=p.locator('[data-clr=accueil-references]');
 const st=await ac.locator('[data-stat]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[l.dataset.stat,+l.querySelector('.clr-refs-stat-n').textContent])));
 ok('accueil : 182 publications, 32 médecins (Florence Comite comptée MD), 268 études',st.x===TOT.posts&&st.medecins===TOT.medecins&&st.etudes===TOT.etudes||st);
 ok('accueil : « 🌍 Dont 122 références internationales : 10 langues, 26 pays »',NB(await ac.locator('[data-clr=accueil-international]').innerText()).includes('Dont 122 références internationales : 10 langues, 26 pays, traduites en français.'));
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click();await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await openAll();
 const card=p.locator('#remede-vitamines-b');ok('Soutien : fiche Vitamines B présente',await card.count()===1);
 const t=NB(await card.innerText());
 ok('fiche B : titre + kicker adulte',(await card.locator('h2,h3').first().innerText()).includes('Vitamines B (complexe B méthylé)')&&t.toUpperCase().includes('SOUTIEN DE FOND · ADULTE'));
 ok('fiche B : B12 250 à 1 000 µg, folate 400 µg (max 1 000 µg d’acide folique), B6 10 mg max au total, ou complexe B méthylé NPN',t.includes(HOW)||t);
 const sec=(await card.locator('[data-clr=vitamines-b-securite] li').allInnerTexts()).map(NB);
 ok('fiche B : Sécurité, 9 points exacts (B6, folate/B12, reins JAMA 2010, Leber, cobalt, metformine/IPP, grossesse, enfants, phénytoïne/méthotrexate)',JSON.stringify(sec)===JSON.stringify(SECB)||sec);
 ok('fiche B : Sécurité étiquetée',(await card.locator('[data-clr=vitamines-b-securite]').getAttribute('aria-label'))==='Sécurité : vitamines B');
 ok('fiche B : étiquette + lien Références Vitamines B (16)',t.includes('Immunité · soutien · adulte')&&(await card.locator('[data-ref-link=vitamines-b]').innerText()).includes('Vitamines B (16)'));
 ok('fiche B : rien de nuancé',!BAD.test(t));
 const vd=p.locator('#remede-vitamines');const vt=NB(await vd.innerText());
 ok('fiche Vitamines C et D : ligne K2 (90 à 120 µg de MK-7, avec la vitamine D, os plutôt qu’artères) après la vitamine D',vt.includes(K2)&&vt.indexOf(VITD[0])<vt.indexOf(K2)||vt);
 const sk=(await vd.locator('[data-clr=vitamines-securite] li').allInnerTexts()).map(NB);
 ok('fiche Vitamines C et D : Sécurité K2, 6 points, warfarine en premier',JSON.stringify(sk)===JSON.stringify(SECK)||sk);
 ok('fiche Vitamines C et D : titre « Sécurité · vitamine K2 » + étiquette',NB(await vd.locator('[data-clr=vitamines-securite] p').first().innerText()).toUpperCase()==='SÉCURITÉ · VITAMINE K2'&&(await vd.locator('[data-clr=vitamines-securite]').getAttribute('aria-label'))==='Sécurité : vitamine K2');
 ok('fiche Vitamines C et D : lien Références Vitamine D et K2 (53), vitamine C inchangée',(await vd.locator('[data-ref-link=vitamine-d]').innerText()).includes('Vitamine D et K2 (53)')&&vt.includes('Vitamine C en soutien : 1 g par jour'));
 for(const [f,w] of [['Fièvre',1],['Prudence',1],['Toux',0],['Gorge',0]]){await clk(f);ok('filtre '+f+' : vitamines B '+(w?'présentes':'absentes'),await has()===!!w);}
 await clk('Tous');
 for(const q of ['vitamines B','méthylcobalamine','folate','B12']){await search(q);ok('recherche : '+q,await has());}
 await search('K2');ok('recherche : K2 → fiche Vitamines C et D',await p.locator('#remede-vitamines').count()===1);
 await search('');await openAll();
 if(dn==='iphone13'){await shotCard(p.locator('#remede-vitamines-b'),'vitb-fiche.png');await shotCard(p.locator('#remede-vitamines'),'vitd-k2-fiche.png');}
 ok('axe fiches (Soutien)',await axe());
 await clk('Conseils');const cs=NB(await p.locator('main').innerText());
 ok('Conseils Soutien : prévention vitamines B + K2 (adulte)',cs.includes(PREVB)&&cs.includes(PREVK)||cs.slice(0,500));
 await clk('Accueil');await openAll();const acc=NB(await p.locator('#prevention').innerText());
 ok('Accueil Soutien : prévention vitamines B + K2 (adulte)',acc.includes(PREVB)&&acc.includes(PREVK));
 await p.locator('.clr-choice-combat button').first().click().catch(async()=>{await clk('Mode Combat');});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();
 const kt=NB(await p.locator('[data-clr=kit]').innerText());
 ok('kit : complexe B méthylé + K2 optionnels (18 éléments)',kt.includes(KITB)&&kt.includes(KITK)&&kt.includes('0 / 18')||kt);
 ok('combat : cinq gestes inchangés, pas de fiche vitamines B',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5&&await p.locator('#remede-vitamines-b').count()===0);
 await clk('Accueil');await p.locator('[data-clr=accueil-references-btn]').click().catch(async()=>{await p.locator('[data-clr=lien-references]').click();});await p.waitForTimeout(600);
 ok('Références ouvertes',(await p.locator('main h1').first().innerText())==='Références');
 const main=NB(await p.locator('main').innerText());
 ok('Références : 182 publications et 268 études',main.includes('182 publications et 268 études scientifiques'));
 ok('Références : 21 thèmes, Vitamines B juste après Vitamine D et K2',await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup)).then(a=>a.length===21&&a[a.indexOf('vitamine-d')+1]==='vitamines-b'));
 const otp=await p.locator('[data-otp]').textContent();
 ok('Références : titres « Vitamines B » et « Vitamine D et K2 » + sommaire (16) et (53)',(await p.locator('#ref-vitamines-b-t').innerText())==='Vitamines B'&&(await p.locator('#ref-vitamine-d-t').innerText())==='Vitamine D et K2'&&otp.includes('Vitamines B (16)')&&otp.includes('Vitamine D et K2 (53)'));
 const grab=async g=>({rs:await g.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,b:l.querySelector('[data-badge]').dataset.badge,pays:l.querySelector('[data-clr=pays]')?.innerText,tr:l.querySelector('[data-clr=traduction]')?.innerText,lang:l.querySelector('blockquote').getAttribute('lang'),intl:l.hasAttribute('data-intl'),t:l.innerText}))),
   es:await g.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,pays:l.querySelector('[data-clr=pays]')?.innerText,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,intl:l.hasAttribute('data-intl'),t:l.innerText})))});
 const gB=p.locator('#ref-vitamines-b'),gD=p.locator('#ref-vitamine-d');const B=await grab(gB),D=await grab(gD);
 for(const [nm,G,P,E,ne] of [['Vitamines B',B,PB,EB,11],['Vitamine D et K2',D,PK,EK,null]]){
  ok(nm+' : publications X ('+P.length+')',P.every(x=>G.rs.some(r=>r.n===x.n&&r.h===x.url))&&(nm==='Vitamines B'?G.rs.length===5:true));
  ok(nm+' : drapeau + pays + langue d’origine',P.every(x=>{const r=G.rs.find(y=>y.n===x.n);return NB(r.pays)===NB(`${x.flag} ${x.country} · publication en ${LANG[x.lang]}`)&&r.lang===x.lang;})||G.rs.map(r=>r.pays));
  ok(nm+' : citation + traduction française + résumé',P.every(x=>{const r=G.rs.find(y=>y.n===x.n);return NB(r.t).includes(NB(x.quote))&&NB(r.tr)===NB('Traduction : « '+x.quoteFr+' »')&&NB(r.t).includes(NB(x.gist));})||G.rs.map(r=>r.n));
  ok(nm+' : étiquettes honnêtes + niveaux',P.every(x=>{const r=G.rs.find(y=>y.n===x.n);return r.lb===(x.notPhysicianLabel??null)&&r.b===x.level;}));
  ok(nm+' : études ('+E.length+') drapeau + pays, DOI + PubMed, titre, résumé, niveau',E.every(x=>{const e=G.es.find(y=>y.n===x.n);return e&&NB(e.pays)===NB(`${x.flag} ${x.country}`)&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})&&(ne?G.es.length===ne:true)||G.es.map(e=>[e.n,e.pays]));
  ok(nm+' : internationales = hors anglais / pays non anglophones',P.every(x=>G.rs.find(y=>y.n===x.n).intl===(x.lang!=='en'))&&E.every(x=>G.es.find(y=>y.n===x.n).intl===(x.intl!==false)));
 }
 ok('Vitamine D et K2 : 28 publications + 25 études (23 + 5 K2 ; 20 + 5 K2)',D.rs.length===28&&D.es.length===25);
 const com=[...B.rs,...D.rs].filter(r=>r.h.includes('/FlorenceComite/'));
 ok('Florence Comite : « Dr Florence Comite, MD », aucune étiquette « non vérifié », source du titre (comitemd.com, PubMed, Yale)',com.length===6&&com.every(r=>r.lb===null&&r.t.includes('Dr Florence Comite, MD')&&r.t.includes('comitemd.com')&&r.t.includes('PubMed')&&r.t.includes('Yale')));
 const ca=await p.locator('#ref-astragale [data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('a[href*="/FlorenceComite/"]')).map(l=>({lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,t:l.innerText})));
 ok('Florence Comite : MD aussi dans Astragale (2 publications)',ca.length===2&&ca.every(r=>r.lb===null&&r.t.includes('Dr Florence Comite, MD')&&r.t.includes('comitemd.com')));
 ok('Florence Comite : nulle part « MD non vérifié »',await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('a[href*="/FlorenceComite/"]')).every(l=>!l.querySelector('[data-clr=pas-medecin]'))));
 const sb=(await p.locator('[data-securite=vitamines-b] li').allInnerTexts()).map(NB);
 ok('Références : Sécurité Vitamines B',JSON.stringify(sb)===JSON.stringify(F.nuances['vitamines-b'].map(NB))||sb);
 const sd=(await p.locator('[data-securite=vitamine-d] li').allInnerTexts()).map(NB);
 ok('Références : Sécurité Vitamine D et K2 (D inchangée + K2)',sd.length===3&&JSON.stringify(sd.slice(1))===JSON.stringify(F.nuances['vitamine-d'].map(NB))||sd);
 ok('Références : sources officielles (Santé Canada B6, NIH ODS B12, EFSA ; Santé Canada vitamine K, Theuwissen 2013)',F.sources['vitamines-b'].every(()=>true)&&await gB.locator('[data-clr=sources-officielles] a').count()===3&&(await Promise.all(F.sources['vitamine-d'].map(o=>gD.locator(`[data-clr=sources-officielles] a[href="${o.url}"]`).count()))).every(c=>c===1));
 ok('Références vitamines B/K2 : rien de nuancé ni contradictoire (textes en français)',!BAD.test(NB([...B.rs,...D.rs.filter(r=>PK.some(x=>x.n===r.n))].map(r=>r.t.replace(/« [^»]*»/g,'')).join(' ')+' '+F.etudes.map(e=>e.finding).join(' '))));
 const ic=NB(await p.locator('[data-clr=ref-international]').innerText());
 ok('indicateur international : 24 publications, 98 études de 26 pays',ic.includes('24 publications de médecins en 10 langues et 98 études de 26 pays')&&ic.includes('(122)')||ic);
 if(dn==='iphone13')await shotAt(gB,'vitb-refs.png');
 ok('axe Références',await axe());
 await clk('Enfant');await p.waitForTimeout(300);
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await clk('Tous');await openAll();
 ok('enfant : fiche vitamines B cachée',await p.locator('#remede-vitamines-b').count()===0);
 await search('méthylcobalamine');ok('enfant : recherche méthylcobalamine vide',await p.locator('#remede-vitamines-b').count()===0);await search('');await openAll();
 const ve=NB(await p.locator('#remede-vitamines').innerText());
 ok('enfant : Vitamines C et D sans conseil K2 ni Sécurité K2 (seul le lien du thème « Vitamine D et K2 » reste), vitamine D gardée',!/K2|MK-7|warfarine/i.test(ve.replace(/Références : Vitamine D et K2 \(\d+\)/,''))&&await p.locator('#remede-vitamines [data-clr=vitamines-securite]').count()===0&&ve.includes(VITD[0])||ve.slice(400));
 await clk('Conseils');const ce=NB(await p.locator('main').innerText());ok('enfant : pas de prévention vitamines B ni K2',!ce.includes('Vitamines B, en prévention')&&!ce.includes('Vitamine K2, avec la vitamine D'));
 await clk('Accueil');await p.locator('.clr-choice-combat button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();await clk('Remèdes');
 const ke=NB(await p.locator('[data-clr=kit]').innerText());ok('enfant : kit sans vitamines B ni K2 (11 éléments)',!/complexe B|K2/i.test(ke)&&ke.includes('0 / 11')||ke);
 await clk('Adulte');
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
