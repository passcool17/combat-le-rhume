// DMSO (diméthylsulfoxyde) (branche fiche-dmso) : 4e fiche de la section « Médicaments dont on parle — sur ordonnance »,
// entre hydroxychloroquine et fenbendazole ; statut Santé Canada (RIMSO-50, vessie seulement), pas de dose pour le rhume,
// Sécurité 4 points sourcés ; cachée en Enfant et Combat ; Références « DMSO (diméthylsulfoxyde) » (3 publications X d’un
// compte anonyme + 5 études « En lien ») ; nouveaux totaux 200 / 314 / 154.
// usage : node tests/clr-dmso.cjs http://localhost:4173/combat-le-rhume/   (captures 412×915 dans combat-le-rhume-shots/dmso/)
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/dmso/';fs.mkdirSync(S,{recursive:true});
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\u2011/g,'-').replace(/\s+/g,' ').trim();
const F=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-dmso-final.json','utf8'));
const SRC=['https://health-products.canada.ca/dpd-bdpp/info?code=3769&lang=fra','https://pdf.hres.ca/dpd_pm/00024764.PDF','https://www.canada.ca/content/dam/dnd-mdn/documents/health/nutrition/supplement-fact-sheet-dmso.pdf','https://dailymed.nlm.nih.gov/dailymed/drugInfo.cfm?setid=58b25d79-78f2-4953-b0c6-61658dc4ef0d','https://pubmed.ncbi.nlm.nih.gov/19380203/'];
const TOT={posts:200,etudes:314,medecins:37,themes:27};
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  ok('JSON final : 3 publications + 5 études, thème dmso',F.posts.length===3&&F.etudes.length===5&&[...F.posts,...F.etudes].every(x=>x.group==='dmso'));
  ok('JSON final : compte anonyme marqué « Anonyme, MD non vérifié »',F.posts.every(p=>p.notPhysician&&p.notPhysicianLabel==='Anonyme, MD non vérifié'&&/non vérifiables/.test(p.credential)));
  ok('JSON final : études « En lien » (aucune étude humaine sur le rhume)',F.etudes.every(e=>e.level==='lien'));
  ok('JSON final : DOI + PubMed + drapeau',F.etudes.every(e=>/^https:\/\/doi\.org\/10\./.test(e.doiUrl)&&/^https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/$/.test(e.pubmed)&&e.flag&&e.country));
  const app=path.join(__dirname,'..');const dist=path.join(app,'..','assets');const js=NB(fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n'));
  ok('site publié : fiche DMSO',['DMSO (diméthylsulfoxyde)','RIMSO-50'].every(x=>js.includes(x)));
  ok('version 4.1.0',JSON.parse(fs.readFileSync(path.join(app,'package.json'),'utf8')).version==='4.1.0');
  ok('pré-cache hors ligne : chaque fichier publié est dans sw.js',fs.readdirSync(dist).every(f=>fs.readFileSync(path.join(app,'..','sw.js'),'utf8').includes('/combat-le-rhume/assets/'+f)));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['android412',{...devices['Pixel 7'],viewport:{width:412,height:915},screen:{width:412,height:915},deviceScaleFactor:2.625}]]){
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
 ok('accueil : 200 publications, 37 médecins, 314 études',st.x===TOT.posts&&st.medecins===TOT.medecins&&st.etudes===TOT.etudes||st);
 ok('accueil : « Dont 154 références internationales »',NB(await ac.locator('[data-clr=accueil-international]').innerText()).includes('Dont 154 références internationales : 11 langues, 32 pays, traduites en français.'));
 await clk('Remèdes');await hide();await openAll();
 const info=p.locator('[data-clr=medicaments-info]');
 ok('section : 4 fiches, DMSO entre hydroxychloroquine et fenbendazole',JSON.stringify(await info.locator('section[id^=info-]').evaluateAll(l=>l.map(x=>x.id)))===JSON.stringify(['info-ivermectine','info-hydroxychloroquine','info-dmso','info-fenbendazole']));
 const card=p.locator('#info-dmso');const t=NB(await card.innerText());
 ok('fiche : titre + kicker',(await card.locator('h2,h3').first().innerText()).includes('DMSO')&&t.toUpperCase().includes('SUR ORDONNANCE · INFO')||t.slice(0,200));
 ok('fiche : statut Santé Canada (RIMSO-50, vessie)',t.includes('RIMSO-50')&&t.includes('cystite interstitielle')&&t.includes('Santé Canada')||t);
 ok('fiche : « Dose et suivi : seulement avec ton médecin. », pas pour le rhume',t.includes('Dose et suivi : seulement avec ton médecin.')&&t.includes('pas pour le rhume'));
 ok('fiche : essais honnêtes (arthrose = placebo)',t.includes('n’a pas fait mieux que le placebo'));
 const sec=(await card.locator('[data-clr=dmso-securite] li').allInnerTexts()).map(NB);
 ok('fiche : Sécurité 4 points sourcés',sec.length===4&&/contaminants/.test(sec[0])&&/ail/.test(sec[1])&&/histamine/.test(sec[2])&&/[Gg]rossesse/.test(sec[3])&&sec.every(x=>/\((Défense nationale du Canada|monographie)/.test(x))||sec);
 ok('fiche : Sécurité étiquetée',(await card.locator('[data-clr=dmso-securite]').getAttribute('aria-label'))==='Sécurité : DMSO');
 ok('fiche : lien Références DMSO (8)',(await card.locator('[data-ref-link=dmso]').innerText()).includes('(8)'));
 ok('fiche : 5 sources réelles',(await Promise.all(SRC.map(h=>card.locator(`a[href="${h}"]`).count()))).every(c=>c>=1));
 await search('DMSO');ok('recherche : DMSO → fiche',await card.count()===1);await search('');await openAll();
 if(dn==='android412'){await shotCard(card,'dmso-fiche.png');await shotAt(card,'dmso-ecran-412x915.png');}
 ok('axe Remèdes',await axe());
 await clk('Accueil');await p.locator('.clr-choice-combat button').first().click();await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();
 ok('combat : pas de fiche DMSO',await card.count()===0&&!/DMSO/.test(NB(await p.locator('[data-clr=kit]').innerText())));
 await clk('Accueil');await p.locator('[data-clr=accueil-references-btn]').click().catch(async()=>{await p.locator('[data-clr=lien-references]').click();});await p.waitForTimeout(600);
 ok('Références : 200 publications et 314 études',NB(await p.locator('main').innerText()).includes('200 publications et 314 études scientifiques'));
 ok('Références : 27 thèmes, DMSO après Hydroxychloroquine',await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup)).then(a=>a.length===TOT.themes&&a[a.indexOf('hydroxychloroquine')+1]==='dmso'));
 const g=p.locator('#ref-dmso');
 ok('Références : titre + sommaire (8)',(await p.locator('#ref-dmso-t').innerText())==='DMSO (diméthylsulfoxyde)'&&(await p.locator('[data-otp]').textContent()).includes('DMSO (diméthylsulfoxyde) (8)'));
 const rs=await g.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),t:l.innerText})));
 const es=await g.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
 ok('publications X = JSON (citation, résumé, crédit anonyme)',rs.length===3&&F.posts.every(x=>{const r=rs.find(y=>y.n===x.n);return r&&r.h===x.url&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist))&&NB(r.t).includes(NB(x.credential));})||rs.map(r=>r.n));
 ok('études = JSON (DOI, PubMed, « En lien », résumé)',es.length===5&&F.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b==='lien'&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>e.n));
 const sb=(await p.locator('[data-securite=dmso] li').allInnerTexts()).map(NB);
 ok('encadré Sécurité Références',JSON.stringify(sb)===JSON.stringify(F.nuances.dmso.map(NB))||sb);
 ok('sources officielles Références',(await Promise.all(F.sources.dmso.map(o=>g.locator(`[data-clr=sources-officielles] a[href="${o.url}"]`).count()))).every(c=>c===1));
 if(dn==='android412')await shotAt(g,'dmso-references-412x915.png');
 ok('axe Références',await axe());
 await clk('Enfant');await p.waitForTimeout(300);
 await clk('Accueil');await p.locator('.clr-choice-soutien button').first().click().catch(()=>{});await p.waitForTimeout(400);await hide();
 await clk('Remèdes');await hide();await clk('Tous');await openAll();
 ok('enfant : fiche DMSO cachée',await p.locator('#info-dmso').count()===0&&await p.locator('[data-clr=medicaments-info]').count()===0);
 await clk('Adulte');
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
