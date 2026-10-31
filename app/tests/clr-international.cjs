// Références internationales (branche references-internationales ; totaux mis à jour avec l’astragale) : 21 publications X en 10 langues + 70 études de 19 pays,
// traduites en français, drapeau + pays (+ langue d’origine pour les publications), thème du remède principal,
// indicateur et filtre « International » dans Références, nouveaux totaux sur l’accueil et dans Références.
// usage : node tests/clr-international.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').trim();
const SRC=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-multilingue.json','utf8'));
const F=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-multilingue-final.json','utf8'));
const LANG={de:'allemand',es:'espagnol',pt:'portugais',it:'italien',zh:'chinois',ja:'japonais',ko:'coréen',hi:'hindi',ar:'arabe',ru:'russe'};
const LBL={'@rodrigomnutri':'Nutritionniste, pas médecin','@drrctripathy':'Praticien ayurvédique, pas médecin','@rialive24':'Agence de presse, pas un médecin'};
const BAD=/mitigé|contradi|nuanc|pas d.effet|aucun effet|non significati|incertain/i;
// Depuis l’astragale (clr-astragale) : +6 publications et +18 études ; 1 publication (chinois) et 16 études de pays non anglophones s’ajoutent à l’international (Iran et Turquie : 21 pays).
// Depuis les vitamines B et la K2 (clr-vitb-k2) : +10 publications et +16 études ; 2 publications (espagnol) et 12 études de pays non anglophones s’ajoutent (Venezuela, Argentine, Éthiopie, Singapour, Pays-Bas : 26 pays) ; Florence Comite comptée MD (34 médecins).
// Depuis la créatine (clr-creatine) : +4 publications (anglais) et +11 études ; 8 études de pays non anglophones s’ajoutent (Serbie, Brésil, Norvège ; Serbie et Norvège nouvelles : 28 pays).
const TOT={posts:191,etudes:290,medecins:34,intl:138,langues:10,pays:28,ip:24,ie:114};
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  ok('JSON final : 21 publications + 70 études, toutes celles de la source',F.posts.length===21&&F.etudes.length===70&&SRC.posts.every(p=>F.posts.some(x=>x.url===p.url))&&SRC.studies.every(e=>F.etudes.some(x=>x.pubmed===e.pubmed)));
  ok('JSON final : niveaux direct/partiel repris de la source',SRC.posts.every(p=>F.posts.find(x=>x.url===p.url).level===(p.level==='direct'?'direct':'partiel'))&&SRC.studies.every(e=>F.etudes.find(x=>x.pubmed===e.pubmed).level===(e.level==='direct'?'direct':'partiel')));
  ok('JSON final : chaque élément a un drapeau et un pays ; chaque publication une langue et une traduction',[...F.posts,...F.etudes].every(x=>x.flag&&x.country)&&F.posts.every(p=>LANG[p.lang]&&p.quoteFr&&p.claim));
  ok('placement : thème du remède principal (ail → « Gingembre, ail et liquides » ; miel + gingembre sec → Gingembre)',SRC.posts.every(p=>{const x=F.posts.find(y=>y.url===p.url);return x.group===(p.handle==='@drrctripathy'?'gingembre':p.group);})&&SRC.studies.every(e=>F.etudes.find(x=>x.pubmed===e.pubmed).group===(e.group==='ail'?'gingembre':e.group)));
  ok('rien de nuancé ni contradictoire dans les ajouts',!BAD.test(JSON.stringify(F))||JSON.stringify(F).match(BAD));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const axe=async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});const v=await p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+' '+v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')));return v.length===0||v;};
 const shotAt=async(loc,file)=>{const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}'});await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(300);await p.screenshot({path:S+file});await st.evaluate(e=>e.remove());};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 // Accueil
 const ac=p.locator('[data-clr=accueil-references]');
 const st=await ac.locator('[data-stat]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[l.dataset.stat,+l.querySelector('.clr-refs-stat-n').textContent])));
 ok('accueil : 191 publications, 34 médecins, 290 études',st.x===TOT.posts&&st.medecins===TOT.medecins&&st.etudes===TOT.etudes||st);
 const ai=NB(await ac.locator('[data-clr=accueil-international]').innerText());
 ok('accueil : « 🌍 Dont 138 références internationales : 10 langues, 28 pays »',ai.includes('Dont 138 références internationales : 10 langues, 28 pays, traduites en français.')||ai);
 ok('accueil : pied « 191 publications et 290 études »',NB(await ac.innerText()).includes('191 publications et 290 études'));
 if(dn==='iphone13')await shotAt(ac,'intl-accueil.png');
 await ac.locator('[data-clr=accueil-references-btn]').click();await p.waitForTimeout(500);
 ok('Références ouvertes',(await p.locator('main h1').first().innerText())==='Références');
 const main=NB(await p.locator('main').innerText());
 ok('Références : 191 publications et 290 études',main.includes('191 publications et 290 études scientifiques'));
 const ic=NB(await p.locator('[data-clr=ref-international]').innerText());
 ok('indicateur : 🌍 Références de 10 langues, 24 publications, 114 études de 28 pays',ic.includes('Références de 10 langues')&&ic.includes('24 publications de médecins en 10 langues et 114 études de 28 pays, traduites en français')||ic);
 ok('23 thèmes (dernier ajout : Créatine)',await p.locator('[data-ref-group]').count()===23);
 // publications
 const rs=await p.locator('[data-ref][data-intl]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,g:l.closest('[data-ref-group]').dataset.refGroup,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),pays:l.querySelector('[data-clr=pays]')?.innerText,tr:l.querySelector('[data-clr=traduction]')?.innerText,lb:l.querySelector('[data-clr=pas-medecin]')?.textContent,b:l.querySelector('[data-badge]').dataset.badge,lang:l.querySelector('blockquote').getAttribute('lang'),t:l.innerText})));
 ok('24 publications internationales (21 + 1 astragale en chinois + 2 vitamines B/K2 en espagnol)',rs.length===TOT.ip||rs.length);
 ok('publications : thème, URL, drapeau + pays + langue d’origine',F.posts.every(x=>{const r=rs.find(y=>y.n===x.n);return r&&r.g===x.group&&r.h===x.url&&NB(r.pays)===NB(`${x.flag} ${x.country} · publication en ${LANG[x.lang]}`)&&r.lang===x.lang;})||rs.map(r=>[r.n,r.pays]));
 ok('publications : citation d’origine + traduction + résumé en français',F.posts.every(x=>{const r=rs.find(y=>y.n===x.n);return NB(r.t).includes(NB(x.quote))&&NB(r.tr)===NB('Traduction : « '+x.quoteFr+' »')&&NB(r.t).includes(NB(x.gist));})||rs.map(r=>r.n));
 ok('publications : étiquettes honnêtes (MD non vérifié, nutritionniste, ayurvédique, agence de presse)',F.posts.every(x=>rs.find(y=>y.n===x.n).lb===(LBL[x.handle]||'MD non vérifié'))||rs.map(r=>[r.n,r.lb]));
 ok('publications : niveaux',F.posts.every(x=>rs.find(y=>y.n===x.n).b===x.level));
 ok('exemples : Suisse (allemand), Russie (agence), Corée du Sud',rs.some(r=>NB(r.pays)==='🇨🇭 Suisse · publication en allemand')&&rs.some(r=>NB(r.pays)==='🇷🇺 Russie · publication en russe'&&r.lb==='Agence de presse, pas un médecin')&&rs.some(r=>NB(r.pays)==='🇰🇷 Corée du Sud · publication en coréen'));
 // études
 const es=await p.locator('[data-etude][data-intl]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,g:l.closest('[data-ref-group]').dataset.refGroup,pays:l.querySelector('[data-clr=pays]')?.innerText,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
 ok('98 études internationales (70 + 16 astragale + 12 vitamines B/K2)',es.length===TOT.ie||es.length);
 ok('études : thème, drapeau + pays, DOI/PubMed, résumé en français, niveau',F.etudes.every(x=>{const e=es.find(y=>y.n===x.n);return e&&e.g===x.group&&NB(e.pays)===NB(`${x.flag} ${x.country}${x.countryNote?` (${x.countryNote})`:''}${x.pubLang?` · article en ${x.pubLang}`:''}`)&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||es.map(e=>[e.n,e.pays]));
 ok('études russes : « article en russe », 2 sans DOI (PubMed seulement)',es.filter(e=>/article en russe/.test(e.pays)).length===4&&F.etudes.filter(x=>!x.doi).length===2);
 ok('rien de nuancé ni contradictoire (ajouts affichés)',!BAD.test([...rs,...es].map(x=>x.t).join(' '))||[...rs,...es].map(x=>x.t).join(' ').match(BAD));
 if(dn==='iphone13'){await shotAt(p.locator('[data-ref][data-intl]').filter({hasText:'@Dr_GIVER'}).first(),'intl-refs.png');}
 // filtre International
 const fb=p.locator('[data-clr=filtre-international]');
 ok('filtre : bouton « Voir seulement l’international (138) »',NB(await fb.innerText())==='Voir seulement l’international (138)'&&await fb.getAttribute('aria-pressed')==='false');
 await fb.click();await p.waitForTimeout(400);
 ok('filtre actif : 24 publications + 98 études, rien d’autre',await fb.getAttribute('aria-pressed')==='true'&&await p.locator('[data-ref]').count()===TOT.ip&&await p.locator('[data-etude]').count()===TOT.ie&&await p.locator('[data-ref]:not([data-intl]),[data-etude]:not([data-intl])').count()===0);
 const gs=await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup));const want=[...new Set([...F.posts,...F.etudes].map(x=>x.group)),'astragale','vitamines-b','nmn','creatine'];
 ok('filtre actif : seulement les thèmes avec des références internationales',gs.length===want.length&&want.every(g=>gs.includes(g))||gs);
 ok('filtre actif : sommaire avec les nombres internationaux (Vitamine D et K2 26)',(await p.locator('[data-otp]').textContent()).includes('Vitamine D et K2 (26)'));
 ok('axe (filtre actif)',await axe());
 await fb.click();await p.waitForTimeout(400);
 ok('filtre désactivé : 191 publications + 290 études',await fb.getAttribute('aria-pressed')==='false'&&await p.locator('[data-ref]').count()===TOT.posts&&await p.locator('[data-etude]').count()===TOT.etudes);
 const toc=NB(await p.locator('[data-otp]').textContent());ok('sommaire complet : Vitamine D et K2 (53), Rinçage et gargarisme (35), Gingembre, ail et liquides (30)',['Vitamine D et K2 (53)','Rinçage et gargarisme (35)','Gingembre, ail et liquides (30)'].every(x=>toc.includes(x))||toc);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
