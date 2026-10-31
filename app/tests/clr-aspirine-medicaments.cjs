// Aspirine + « Médicaments dont on parle — sur ordonnance » (branche aspirine-et-medicaments) :
// fiche Aspirine adulte (Santé Canada : 325 à 650 mg toutes les 4 à 6 h, max 4 000 mg/jour), Sécurité 8 points sourcés, cachée en Enfant
// avec une carte « Pas d’aspirine » (Reye) en Enfant ; 3 fiches d’info (ivermectine, hydroxychloroquine, fenbendazole) sans dose,
// cachées en Enfant et en Combat, pas de kit ni de prévention ; Références « Aspirine », « Ivermectine », « Hydroxychloroquine » ; nouveaux totaux.
// usage : node tests/clr-aspirine-medicaments.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/aspirine-medicaments/';fs.mkdirSync(S.endsWith('/')?S:path.dirname(S),{recursive:true});
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\u2011/g,'-').replace(/\s+/g,' ').trim();
const F=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-aspmed-final.json','utf8'));
const TITRE='Aspirine : fièvre, courbatures et mal de gorge';
const HOW='Aspirine (AAS, acide acétylsalicylique) : 325 à 650 mg toutes les 4 à 6 heures au besoin, au plus 4 000 mg par jour, avec un grand verre d’eau ou de lait (250 mL). Prends la plus petite dose qui te soulage. Adulte de 18 ans et plus (Santé Canada).';
const SECKEYS=[/Reye/,/ulcère.*saignements/,/anticoagulant/,/Asthme/,/Grossesse.*dernier trimestre/,/allergique aux salicylates.*AINS/,/Pas plus de 5 jours.*3 jours/,/oreilles bourdonnent/];
const GR={aspirine:{posts:0,etudes:8},ivermectine:{posts:3,etudes:4},hydroxychloroquine:{posts:3,etudes:7}};
const SRC={ivermectine:['https://recalls-rappels.canada.ca/fr/avis-rappel/ivermectine-n-est-pas-homologuee-pour-prevention-ni-pour-traitement-covid-19-et-peut'],hydroxychloroquine:['https://recalls-rappels.canada.ca/fr/avis-rappel/chloroquine-et-hydroxychloroquine-peuvent-entrainer-graves-effets-secondaires-ces','https://www.sanofi.com/assets/countries/canada/docs/products/prescription-products/plaquenil-fr.pdf'],fenbendazole:['https://health-products.canada.ca/dpd-bdpp/search-fast-recherche-rapide?lang=fra&no=0113905004','https://inspection.canada.ca/en/animal-health/livestock-feeds/medicating-ingredients/fenbendazole','https://pubmed.ncbi.nlm.nih.gov/41608149/','https://pubmed.ncbi.nlm.nih.gov/42383214/','https://pubmed.ncbi.nlm.nih.gov/42299164/']};
const TOT={posts:197,etudes:309,medecins:37,themes:26};
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  ok('JSON final : comptes par thème',Object.entries(GR).every(([g,c])=>F.posts.filter(p=>p.group===g).length===c.posts&&F.etudes.filter(e=>e.group===g).length===c.etudes));
  ok('JSON final : pas de thème fenbendazole',![...F.posts,...F.etudes].some(x=>x.group==='fenbendazole'));
  ok('JSON final : URL/PMID uniques, drapeau + pays, DOI + PubMed',new Set(F.posts.map(x=>x.url)).size===F.posts.length&&new Set(F.etudes.map(x=>x.pubmed)).size===F.etudes.length&&[...F.posts,...F.etudes].every(x=>x.flag&&x.country)&&F.etudes.every(e=>/^https:\/\/doi\.org\/10\./.test(e.doiUrl)&&/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/.test(e.pubmed)));
  ok('JSON final : publications de médecins, crédits et pays',F.posts.every(p=>!p.notPhysician&&p.credential&&p.country));
  ok('JSON final : Kory, retrait des certifications dit honnêtement',F.posts.filter(p=>p.handle==='@PierreKory').every(p=>/certifications de l’ABIM .* retirées/.test(p.credential)));
  ok('JSON final : Raoult en français, sans traduction, rétractation mentionnée',F.posts.filter(p=>p.handle==='@raoult_didier').every(p=>p.lang==='fr'&&p.quoteFr===null&&/rétract/.test(p.credential)&&!('intl' in p)));
  ok('JSON final : études de laboratoire au niveau « lien »',F.etudes.filter(e=>/^En laboratoire/.test(e.finding)).every(e=>e.level==='lien'));
  const app=path.join(__dirname,'..');const dist=path.join(app,'..','assets');const js=NB(fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n'));
  ok('site publié : fiche aspirine + 3 fiches info',[TITRE,HOW,'Médicaments dont on parle — sur ordonnance','Ivermectine','Hydroxychloroquine','Fenbendazole'].every(x=>js.includes(x)));
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
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 const ac=p.locator('[data-clr=accueil-references]');
 const st=await ac.locator('[data-stat]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[l.dataset.stat,+l.querySelector('.clr-refs-stat-n').textContent])));
 ok('accueil : 197 publications, 37 médecins, 309 études',st.x===TOT.posts&&st.medecins===TOT.medecins&&st.etudes===TOT.etudes||st);
 ok('accueil : « Dont 152 références internationales : 11 langues, 32 pays »',NB(await ac.locator('[data-clr=accueil-international]').innerText()).includes('Dont 152 références internationales : 11 langues, 32 pays, traduites en français.'));
 await clk('Remèdes');await hide();await openAll();
 const card=p.locator('#remede-aspirine');ok('fiche aspirine présente, juste après créatine',await card.count()===1&&await p.locator('[id^=remede-]').evaluateAll(l=>{const a=l.map(x=>x.id).filter(i=>!i.endsWith('-contenu'));return a[a.indexOf('remede-creatine')+1]==='remede-aspirine';}));
 const t=NB(await card.innerText());
 ok('fiche : titre + kicker',(await card.locator('h2,h3').first().innerText()).includes(TITRE)&&t.toUpperCase().includes('SOULAGEMENT · ADULTE'));
 ok('fiche : dose Santé Canada',t.includes(HOW)||t);
 ok('fiche : consulter après 5 jours (douleur) ou 3 jours (fièvre)',t.includes('plus de 5 jours ou la fièvre plus de 3 jours'));
 const sec=(await card.locator('[data-clr=aspirine-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité 8 points (Reye, ulcères, anticoagulants, asthme, grossesse, AINS, durée, oreilles), chacun sourcé',sec.length===8&&SECKEYS.every((r,i)=>r.test(sec[i]))&&sec.every(x=>x.includes('(Santé Canada)'))||sec);
 ok('fiche : Sécurité étiquetée',(await card.locator('[data-clr=aspirine-securite]').getAttribute('aria-label'))==='Sécurité : aspirine');
 ok('fiche : lien Références Aspirine (8)',(await card.locator('[data-ref-link=aspirine]').innerText()).includes('Aspirine (8)'));
 for(const q of ['aspirine','AAS','courbatures']){await search(q);ok('recherche : '+q,await card.count()===1);}
 await search('');
 await clk('Fièvre');ok('filtre Fièvre : aspirine',await card.count()===1);await clk('Gorge');ok('filtre Gorge : aspirine',await card.count()===1);
 ok('filtre Gorge : pas de section info',await p.locator('[data-clr=medicaments-info]').count()===0);await clk('Tous');await openAll();
 const info=p.locator('[data-clr=medicaments-info]');
 ok('section « Médicaments dont on parle — sur ordonnance »',await info.count()===1&&(await info.locator('h2').first().innerText())==='Médicaments dont on parle — sur ordonnance');
 ok('section : 3 fiches dans l’ordre',JSON.stringify(await info.locator('section[id^=info-]').evaluateAll(l=>l.map(x=>x.id)))===JSON.stringify(['info-ivermectine','info-hydroxychloroquine','info-fenbendazole']));
 const T=async id=>NB(await p.locator('#info-'+id).innerText());
 for(const id of ['ivermectine','hydroxychloroquine','fenbendazole']){const x=await T(id);
  ok(id+' : « Dose et suivi : seulement avec ton médecin. », aucune dose en mg',x.includes('Dose et suivi : seulement avec ton médecin.')&&!/\d\s?(mg|µg|g)\b/.test(x.replace(/Santé Canada.*$/,''))||x);
  ok(id+' : Sécurité étiquetée',(await p.locator(`[data-clr=${id}-securite]`).getAttribute('aria-label'))==='Sécurité : '+id);}
 const iv=await T('ivermectine'),hc=await T('hydroxychloroquine'),fb=await T('fenbendazole');
 ok('ivermectine : ordonnance, essais TOGETHER / ACTIV-6 / PRINCIPLE, jamais vétérinaire, surdose',iv.includes('sur ordonnance seulement')&&['TOGETHER (NEJM 2022)','ACTIV-6 (JAMA 2022)','PRINCIPLE'].every(k=>iv.includes(k))&&iv.includes('Jamais de produit pour animaux')&&iv.includes('Une surdose est toxique'));
 ok('hydroxychloroquine : ordonnance, RECOVERY / Solidarity, QT, hypoglycémie, yeux',hc.includes('sur ordonnance seulement')&&hc.includes('RECOVERY (NEJM 2020)')&&hc.includes('Solidarity de l’OMS')&&hc.includes('QT')&&hc.includes('hypoglycémie')&&hc.includes('rétine'));
 ok('fenbendazole : vétérinaire, jamais homologué pour l’humain, foie, aucun essai, pas de thème Références',fb.includes('produit vétérinaire seulement')&&fb.includes('jamais été homologué pour l’humain')&&fb.includes('foie')&&fb.includes('Aucun essai chez l’humain')&&await p.locator('#info-fenbendazole [data-ref-link]').count()===0);
 ok('liens Références des fiches info',(await p.locator('#info-ivermectine [data-ref-link=ivermectine]').innerText()).includes('Ivermectine (7)')&&(await p.locator('#info-hydroxychloroquine [data-ref-link=hydroxychloroquine]').innerText()).includes('Hydroxychloroquine (10)'));
 for(const [id,u] of Object.entries(SRC))ok(id+' : sources officielles et études (liens réels, vérifiés)',(await Promise.all(u.map(h=>p.locator(`#info-${id} a[href="${h}"]`).count()))).every(c=>c>=1));
 await search('ivermectine');ok('recherche : ivermectine → fiche info',await p.locator('#info-ivermectine').count()===1);await search('');await openAll();
 if(dn==='iphone13'){await shotCard(card,'aspirine-fiche.png');await shotCard(p.locator('#info-ivermectine'),'ivermectine-fiche-info.png');await shotCard(p.locator('#info-fenbendazole'),'fenbendazole-fiche-info.png');}
 ok('axe Remèdes',await axe());
 await clk('Conseils');ok('Conseils : pas de prévention aspirine ni médicaments',!/aspirine|ivermectine|hydroxychloroquine|fenbendazole/i.test(NB(await p.locator('main').innerText())));
 await clk('Accueil');await p.locator('.clr-choice-combat button').first().click();await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();
 const kt=NB(await p.locator('[data-clr=kit]').innerText());ok('kit : inchangé (19), sans aspirine ni médicaments',!/aspirine|ivermectine|hydroxychloroquine|fenbendazole/i.test(kt)&&kt.includes('0 / 19')||kt);
 ok('combat : ni fiche aspirine ni section info',await card.count()===0&&await p.locator('[data-clr=medicaments-info]').count()===0);
 await clk('Accueil');await p.locator('[data-clr=accueil-references-btn]').click().catch(async()=>{await p.locator('[data-clr=lien-references]').click();});await p.waitForTimeout(600);
 ok('Références ouvertes',(await p.locator('main h1').first().innerText())==='Références');
 ok('Références : 197 publications et 309 études',NB(await p.locator('main').innerText()).includes('197 publications et 309 études scientifiques'));
 ok('Références : 26 thèmes, Aspirine, Ivermectine, Hydroxychloroquine après Créatine',await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup)).then(a=>a.length===TOT.themes&&a.slice(a.indexOf('creatine'),a.indexOf('creatine')+4).join()==='creatine,aspirine,ivermectine,hydroxychloroquine'));
 for(const [gid,ti,c] of [['aspirine','Aspirine',8],['ivermectine','Ivermectine',7],['hydroxychloroquine','Hydroxychloroquine',10]]){
  ok(`Références : « ${ti} » + sommaire (${c})`,(await p.locator(`#ref-${gid}-t`).innerText())===ti&&(await p.locator('[data-otp]').textContent()).includes(`${ti} (${c})`));
  const g=p.locator('#ref-'+gid);
  const rs=await g.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),pays:l.querySelector('[data-clr=pays]')?.innerText,tr:l.querySelector('[data-clr=traduction]')?.innerText??null,lang:l.querySelector('blockquote').getAttribute('lang'),intl:l.hasAttribute('data-intl'),t:l.innerText})));
  const es=await g.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,pays:l.querySelector('[data-clr=pays]')?.innerText,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,intl:l.hasAttribute('data-intl'),t:l.innerText})));
  const FP=F.posts.filter(x=>x.group===gid),FE=F.etudes.filter(x=>x.group===gid);
  ok(ti+' : publications X = JSON, crédit + pays + citation + résumé',rs.length===FP.length&&FP.every(x=>{const r=rs.find(y=>y.n===x.n);return r&&r.h===x.url&&NB(r.pays).startsWith(NB(`${x.flag} ${x.country}`))&&r.lang===x.lang&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist))&&NB(r.t).includes(NB(x.credential))&&(x.quoteFr?NB(r.tr)===NB('Traduction : « '+x.quoteFr+' »'):r.tr===null);})||rs.map(r=>[r.n,r.pays,r.tr]));
  ok(ti+' : études = JSON, drapeau + pays, DOI + PubMed, niveau, résumé',es.length===FE.length&&FE.every(x=>{const e=es.find(y=>y.n===x.n);return e&&NB(e.pays).startsWith(NB(`${x.flag} ${x.country}`))&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>[e.n,e.pays]));
  ok(ti+' : international = pays non anglophones',[...rs.map(r=>[r,FP.find(x=>x.n===r.n)]),...es.map(e=>[e,FE.find(x=>x.n===e.n)])].every(([u,x])=>u.intl===(x.intl!==false)));
  const sb=(await p.locator(`[data-securite=${gid}] li`).allInnerTexts()).map(NB);
  ok(ti+' : encadré Sécurité Références',JSON.stringify(sb)===JSON.stringify(F.nuances[gid].map(NB))||sb);
  ok(ti+' : sources officielles',(await Promise.all(F.sources[gid].map(o=>g.locator(`[data-clr=sources-officielles] a[href="${o.url}"]`).count()))).every(c=>c===1));
  if(dn==='iphone13')await shotAt(g,`${gid}-refs.png`);}
 const ic=NB(await p.locator('[data-clr=ref-international]').innerText());
 ok('indicateur international : 26 publications, 126 études de 32 pays (152)',ic.includes('26 publications de médecins en 11 langues et 126 études de 32 pays')&&ic.includes('(152)')||ic);
 ok('axe Références',await axe());
 await clk('Enfant');await p.waitForTimeout(300);
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await clk('Tous');await openAll();
 ok('enfant : fiche aspirine cachée',await p.locator('#remede-aspirine').count()===0);
 ok('enfant : section info cachée',await p.locator('[data-clr=medicaments-info]').count()===0);
 const ae=p.locator('[data-clr=aspirine-enfant]');
 ok('enfant : carte « Pas d’aspirine » avec le syndrome de Reye',await ae.count()===1&&/Pas d’aspirine/.test(await ae.innerText())&&/syndrome de Reye/.test(await ae.innerText())&&/moins de 18 ans/.test(await ae.innerText()));
 if(dn==='iphone13')await shotCard(ae,'aspirine-enfant-reye.png');
 await search('aspirine');ok('enfant : recherche aspirine sans fiche',await p.locator('#remede-aspirine').count()===0);await search('');
 ok('axe Enfant',await axe());
 await clk('Adulte');
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
