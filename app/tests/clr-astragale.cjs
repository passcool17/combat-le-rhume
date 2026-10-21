// Astragale (branche astragale) : fiche adulte seulement (cachée en profil Enfant, comme la NAC), dose Santé Canada 2 à 4,8 g
// + proposition pratique, encadré Sécurité (7 points), Kit Combat optionnel (16 éléments), prévention (Soutien, adulte),
// Références : nouveau groupe « Astragale » (6 publications X + 18 études, drapeau + pays, traduction, étiquettes honnêtes),
// nouveaux totaux ; absinthe et sarsepareille absentes.
// usage : node tests/clr-astragale.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\u2011/g,'-').replace(/\s+/g,' ').trim();
const SRC=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-sarsepareille-absinthe-astragale.json','utf8')).remedies.astragale;
const F=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-astragale-final.json','utf8'));
const HOW='Santé Canada : 2 à 4,8 g de racine séchée par jour (gélules, teinture ou tisane), pour l’adulte de 18 ans et plus. En pratique : 2 à 4 g par jour, ou une décoction de 10 à 15 g de tranches mijotées 20 à 25 minutes, à boire en 2 tasses par jour, pendant la saison des rhumes et grippes.';
const EXTRA=['Racine d’astragale (Astragalus membranaceus, huang qi 黄芪) : utilisée en médecine chinoise pour renforcer les défenses, et en phytothérapie pour aider à garder un système immunitaire en santé (Santé Canada).','Décoction : 10 à 15 g de tranches séchées (environ 5 à 8 tranches) dans l’eau, à feu doux 20 à 25 minutes. Filtrer et boire en 2 tasses dans la journée.','Gélules ou teinture : choisis un produit avec un numéro NPN de Santé Canada.'];
const SEC=['Maladie auto-immune (lupus, polyarthrite rhumatoïde, sclérose en plaques, etc.) : pas d’astragale, car elle stimule l’immunité.','Immunosuppresseurs (cyclosporine, tacrolimus, mycophénolate, cyclophosphamide, après une greffe) : ne pas en prendre, l’astragale peut contrer leur effet.','Lithium : l’astragale peut réduire son élimination et augmenter son taux dans le sang. Évite-la ou parles-en au médecin.','Grossesse et allaitement : à éviter.','Enfants et adolescents : pas d’astragale. La dose de Santé Canada vise l’adulte de 18 ans et plus.','Achète seulement la racine d’A. membranaceus ou d’A. mongholicus, d’une source fiable : d’autres espèces d’Astragalus sont toxiques.','Diabète ou hypertension sous traitement : parles-en au médecin ou au pharmacien avant.'];
const KIT='Optionnel (adulte) : racine d’astragale, en gélules avec numéro NPN ou en tranches séchées pour la décoction';
const PREV='Astragale, en prévention (adulte) : 2 à 4 g de racine séchée par jour, ou une décoction de 10 à 15 g de tranches mijotées 20 à 25 minutes, en 2 tasses par jour, pendant la saison des rhumes et grippes.';
const MIEL='Pour le mal de gorge, prendre seulement du miel : 1 cuillère à soupe de miel seul, avec une cuillère qui n’est pas en métal (bois, plastique ou céramique). Pas dans une tisane, pas de citron.';
const LANG={en:'anglais',zh:'chinois'};
const BAD=/mitigé|contradi|nuanc|pas d.effet|aucun effet|non significati|incertain|preuves? (faible|insuffisant)|Cochrane|faible à modérée/i;
// Totaux mis à jour avec les vitamines B et la K2 (clr-vitb-k2) ; le groupe Astragale est inchangé.
const TOT={posts:182,etudes:268,medecins:32,intl:122,langues:10,pays:26,groupe:24};
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const app=process.env.APPDIR||path.join(__dirname,'..');const rd=f=>fs.readFileSync(path.join(app,f),'utf8');const c=rd('src/data/contenu.js');
  ok('JSON final : 6 publications + 18 études, toutes celles de la source',F.posts.length===6&&F.etudes.length===18&&SRC.posts.every(p=>F.posts.some(x=>x.url===p.url))&&SRC.studies.every(e=>F.etudes.some(x=>x.pubmed===e.pubmed&&x.doiUrl===e.doiUrl)));
  ok('JSON final : niveaux (publications direct/partiel de la source ; études partiel)',SRC.posts.every(p=>F.posts.find(x=>x.url===p.url).level===(p.level==='direct'?'direct':'partiel'))&&F.etudes.every(e=>e.level==='partiel'));
  ok('JSON final : drapeau + pays partout, langue + traduction pour chaque publication',[...F.posts,...F.etudes].every(x=>x.flag&&x.country&&x.group==='astragale')&&F.posts.every(p=>LANG[p.lang]&&p.quoteFr));
  ok('JSON final : rien de nuancé ni contradictoire (textes en français)',!BAD.test([...F.posts.map(p=>p.claim+' '+p.gist+' '+p.quoteFr+' '+p.supportNote),...F.etudes.map(e=>e.finding+' '+e.supportNote),...F.nuances].join(' ')));
  ok('sources : Cochrane Su 2016 absente',!JSON.stringify(F).includes('27905672')&&!rd('src/data/references.js').includes('27905672'));
  ok('sources : miel seul inchangé',c.includes(MIEL));
  const dist=path.join(app,'..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n');
  ok('site publié : fiche astragale (dose, Sécurité, prévention, kit)',[HOW,...SEC,PREV,KIT].every(x=>NB(js).includes(x)));
  ok('site publié : ni absinthe ni sarsepareille',!/absinthe|absinthium|wormwood|sarsepareille|sarsaparilla|Smilax/i.test(js));
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
 const has=async()=>await p.locator('#remede-astragale').count()===1;
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 // Accueil : nouveaux totaux
 const ac=p.locator('[data-clr=accueil-references]');
 const st=await ac.locator('[data-stat]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[l.dataset.stat,+l.querySelector('.clr-refs-stat-n').textContent])));
 ok('accueil : 182 publications, 32 médecins, 268 études',st.x===TOT.posts&&st.medecins===TOT.medecins&&st.etudes===TOT.etudes||st);
 ok('accueil : « 🌍 Dont 122 références internationales : 10 langues, 26 pays »',NB(await ac.locator('[data-clr=accueil-international]').innerText()).includes('Dont 122 références internationales : 10 langues, 26 pays, traduites en français.'));
 // Fiche (sans mode, puis Soutien)
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click();await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await openAll();
 const card=p.locator('#remede-astragale');ok('Soutien : fiche Astragale présente',await card.count()===1);
 const t=NB(await card.innerText());
 ok('fiche : titre + kicker adulte',(await card.locator('h2,h3').first().innerText()).includes('Astragale')&&t.toUpperCase().includes('SAISON DES RHUMES ET GRIPPES · ADULTE'));
 ok('fiche : dose Santé Canada 2 à 4,8 g (18 ans et plus) + proposition 2 à 4 g ou décoction 10 à 15 g, 20 à 25 min, 2 tasses',t.includes(HOW)||t);
 ok('fiche : huang qi, décoction, NPN',EXTRA.every(x=>t.includes(x))||t);
 const sec=(await card.locator('[data-clr=astragale-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité, 7 points exacts (auto-immun, immunosuppresseurs, lithium, grossesse, enfants, espèces, diabète/hypertension)',JSON.stringify(sec)===JSON.stringify(SEC)||sec);
 ok('fiche : Sécurité étiquetée',(await card.locator('[data-clr=astragale-securite]').getAttribute('aria-label'))==='Sécurité : astragale');
 ok('fiche : étiquette + lien Références Astragale (24)',t.includes('Immunité · prévention · adulte')&&(await card.locator('[data-ref-link=astragale]').innerText()).includes('Astragale (24)'));
 ok('fiche : 3 % Food Grade inchangé, rien de nuancé',!BAD.test(t));
 for(const [f,w] of [['Fièvre',1],['Prudence',1],['Toux',0],['Gorge',0]]){await clk(f);ok('filtre '+f+' : astragale '+(w?'présente':'absente'),await has()===!!w);}
 await clk('Tous');
 for(const q of ['astragale','huang qi','Astragalus']){await search(q);ok('recherche : '+q,await has());}
 await search('');await openAll();
 if(dn==='iphone13')await shotCard(p.locator('#remede-astragale'),'astragale-fiche.png');
 ok('axe fiche (Soutien)',await axe());
 // Prévention (Soutien, adulte)
 await clk('Conseils');const cs=NB(await p.locator('main').innerText());
 ok('Conseils Soutien : prévention astragale (adulte)',cs.includes(PREV)||cs.slice(0,500));
 await clk('Accueil');await openAll();const acc=NB(await p.locator('#prevention').innerText());
 ok('Accueil Soutien : prévention astragale (adulte)',acc.includes(PREV));
 // Mode Combat : kit
 await p.locator('.clr-choice-combat button').first().click().catch(async()=>{await clk('Mode Combat');});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();
 const kt=NB(await p.locator('[data-clr=kit]').innerText());
 ok('kit : astragale optionnelle (18 éléments, avec les vitamines B et la K2)',kt.includes(KIT)&&kt.includes('0 / 18')||kt);
 ok('combat : cinq gestes inchangés, pas de fiche astragale',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5&&await p.locator('#remede-astragale').count()===0);
 // Références
 await p.locator('[data-ref-link]').first().click().catch(()=>{});await p.waitForTimeout(300);
 await clk('Accueil');await p.locator('[data-clr=accueil-references-btn]').click().catch(async()=>{await p.locator('[data-clr=lien-references]').click();});await p.waitForTimeout(600);
 ok('Références ouvertes',(await p.locator('main h1').first().innerText())==='Références');
 const main=NB(await p.locator('main').innerText());
 ok('Références : 182 publications et 268 études',main.includes('182 publications et 268 études scientifiques'));
 ok('Références : 21 thèmes, Astragale juste après la NAC',await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup)).then(a=>a.length===21&&a[a.indexOf('nac')+1]==='astragale'));
 ok('Références : titre « Astragale » + sommaire Astragale (24)',(await p.locator('#ref-astragale-t').innerText())==='Astragale'&&(await p.locator('[data-otp]').textContent()).includes('Astragale (24)'));
 const g=p.locator('#ref-astragale');
 const rs=await g.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,b:l.querySelector('[data-badge]').dataset.badge,pays:l.querySelector('[data-clr=pays]')?.innerText,tr:l.querySelector('[data-clr=traduction]')?.innerText,lang:l.querySelector('blockquote').getAttribute('lang'),intl:l.hasAttribute('data-intl'),t:l.innerText})));
 ok('6 publications X',rs.length===6&&F.posts.every(x=>rs.some(r=>r.n===x.n&&r.h===x.url)));
 ok('publications : drapeau + pays + langue d’origine',F.posts.every(x=>{const r=rs.find(y=>y.n===x.n);return NB(r.pays)===NB(`${x.flag} ${x.country} · publication en ${LANG[x.lang]}`)&&r.lang===x.lang;})||rs.map(r=>r.pays));
 ok('publications : citation + traduction française + résumé',F.posts.every(x=>{const r=rs.find(y=>y.n===x.n);return NB(r.t).includes(NB(x.quote))&&NB(r.tr)===NB('Traduction : « '+x.quoteFr+' »')&&NB(r.t).includes(NB(x.gist));})||rs.map(r=>r.n));
 ok('publications : étiquettes honnêtes (Comite : MD, titre confirmé ; Zhang : MD non vérifié ; Weil, Mercola : comme ailleurs dans l’appli)',F.posts.every(x=>rs.find(y=>y.n===x.n).lb===(x.notPhysicianLabel??null))&&rs.filter(r=>r.lb==='MD non vérifié').length===1&&rs.filter(r=>r.h.includes('/FlorenceComite/')).every(r=>r.lb===null&&r.t.includes('Dr Florence Comite, MD')&&r.t.includes('comitemd.com')));
 ok('publications : niveaux (3 directes, 3 en partie)',F.posts.every(x=>rs.find(y=>y.n===x.n).b===x.level)&&rs.filter(r=>r.b==='direct').length===3);
 ok('publications : seule celle en chinois compte comme internationale',rs.filter(r=>r.intl).length===1&&rs.find(r=>r.intl).lang==='zh');
 const es=await g.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,pays:l.querySelector('[data-clr=pays]')?.innerText,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,intl:l.hasAttribute('data-intl'),t:l.innerText})));
 ok('18 études',es.length===18);
 ok('études : drapeau + pays, DOI + PubMed, titre, résumé, niveau',F.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&NB(e.pays)===NB(`${x.flag} ${x.country}`)&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>[e.n,e.pays]));
 ok('études : 16 internationales (Chine, Taïwan, Iran, Turquie), 2 des États-Unis',es.filter(e=>e.intl).length===16&&es.filter(e=>!e.intl).every(e=>e.pays.includes('États-Unis')));
 const sx=(await p.locator('[data-securite=astragale] li').allInnerTexts()).map(NB);
 ok('Références : Sécurité Astragale',JSON.stringify(sx)===JSON.stringify(F.nuances.map(NB))||sx);
 ok('Références : 2 sources officielles (Santé Canada, NCCIH)',await g.locator('[data-clr=sources-officielles] a[href="https://webprod.hc-sc.gc.ca/nhpid-bdipsn/dbImages/mono_astragalus_english.pdf"]').count()===1&&await g.locator('[data-clr=sources-officielles] a[href="https://www.nccih.nih.gov/health/astragalus"]').count()===1);
 ok('Références astragale : rien de nuancé ni contradictoire (textes en français)',!BAD.test(NB([...rs.map(r=>r.t.replace(r.t.match(/« [^»]*»/)?.[0]||'','')),...F.etudes.map(e=>e.finding)].join(' '))));
 const ic=NB(await p.locator('[data-clr=ref-international]').innerText());
 ok('indicateur international : 24 publications, 98 études de 26 pays',ic.includes('24 publications de médecins en 10 langues et 98 études de 26 pays')||ic);
 if(dn==='iphone13')await shotAt(g,'astragale-refs.png');
 ok('axe Références',await axe());
 // Profil Enfant
 await clk('Enfant');await p.waitForTimeout(300);
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await clk('Tous');await openAll();
 ok('enfant : fiche astragale cachée',await p.locator('#remede-astragale').count()===0);
 await search('astragale');ok('enfant : recherche astragale vide',await p.locator('#remede-astragale').count()===0);await search('');
 await clk('Conseils');ok('enfant : pas de prévention astragale',!NB(await p.locator('main').innerText()).includes('Astragale, en prévention'));
 await clk('Accueil');await p.locator('.clr-choice-combat button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();await clk('Remèdes');
 const ke=NB(await p.locator('[data-clr=kit]').innerText());ok('enfant : kit sans astragale (11 éléments)',!/astragale/i.test(ke)&&ke.includes('0 / 11')||ke);
 await clk('Adulte');
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
