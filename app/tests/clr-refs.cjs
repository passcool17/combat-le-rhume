const {chromium,devices}=require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const J=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs.json','utf8'));
const C=J.chaleur_corps;const A=J.autres_refs;
// refs-plus : 31 publications X + 24 études ajoutées (combat-le-rhume-refs-new.json), groupe « Peroxyde »
const NW=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs-new.json','utf8'));const NP=NW.posts;const NE=NW.etudes;
// doses-refs : 20 publications X + 21 études (combat-le-rhume-refs-new2-final.json ; Sulistyani 2022 et Burgos-Ramos 2022 retirées : l'eau fait aussi bien)
const N2=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs-new2-final.json','utf8'));
// argent-colloidal : 4 publications X + 8 études (combat-le-rhume-argent-final.json), groupe « Argent colloïdal » ; Scott 2017 absent (négatif)
const N3=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-argent-final.json','utf8'));
// refs-grippe : 12 publications X + 28 études (combat-le-rhume-refs-grippe-final.json), nouveau groupe « Cuivre » (4 études) ; Puchkova 2021, Rupp 2017, Stella Immanuel absents
const N4=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs-grippe-final.json','utf8'));
// quercetine : 6 publications X + 10 études (combat-le-rhume-quercetine-final.json), groupe « Quercétine » ; Önal 2021 absent (sans effet sur les événements)
const N5=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-quercetine-final.json','utf8'));
// girofle : 6 publications X + 11 études (combat-le-rhume-girofle-final.json), groupe « Clou de girofle » ; Kiki 2023 absent (faible contre l’herpès, nul contre l’adénovirus)
const N6=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-girofle-final.json','utf8'));
// nac-echinacee-gingembre : 24 publications X + 31 études (combat-le-rhume-nac-echinacee-gingembre-final.json), nouveau groupe « NAC (N-acétylcystéine) » ; ajouts Échinacée et Gingembre
const N7=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-nac-echinacee-gingembre-final.json','utf8'));
// references-internationales : 21 publications X (10 langues) + 70 études (19 pays) traduites (combat-le-rhume-multilingue-final.json), dans les thèmes existants
const N8=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-multilingue-final.json','utf8'));
const XS=[...J.entries,...C.x_posts,...A.x_posts,...NP,...N2.posts,...N3.posts,...N4.posts,...N5.posts,...N6.posts,...N7.posts,...N8.posts];const URLS=XS.map(e=>e.url).sort();
const lv=s=>{s=s.toLowerCase();return s.startsWith('appuie directement')?'direct':s.startsWith('partiel')?'partiel':s.startsWith('lié')?'lien':null;};
// niveaux des nouvelles publications « appuie (réserve) » décidés à l'ajout : X4 partiel, X5 direct
// chaleur : 12 études (HEAT retiré, demande de l'utilisateur : rien qui contredise l'appli)
const ELV=['direct','direct','partiel','partiel','direct','direct','partiel','partiel','partiel','lien','partiel','direct'];
// autres_refs X1–X7 : décidés à l'ajout (« appuie (réserve) » → partiel, « en lien » → lien)
const LV=XS.map((e,i)=>i>=42?e.level:({25:'partiel',26:'direct',35:'direct',36:'partiel',37:'partiel',38:'partiel',39:'partiel',40:'partiel',41:'lien'})[i]??lv(e.support));
const GID={'Vitamine C':'vitamine-c','Miel':'miel','Zinc':'zinc','Sureau':'sureau','Échinacée':'echinacee','Vitamine D':'vitamine-d','Sommeil et repos':'sommeil','Rinçage et gargarisme':'rincage','Sprays et kit':'sprays','Gingembre/ail/liquides':'gingembre','Chaleur du corps et fièvre':'chaleur'};
// autres : 21 études. Retirées : Hemilä 2013 Cochrane (i0), Karsch-Völk 2014 (i10), Satomura 2005 dans Sprays (i19).
// Gardées avec seulement leur partie qui appuie l'appli : Nault 2024 (i7), King 2015 (i16), Satomura 2005 eau (i18), Lissiman 2014 ail (i20).
const FIX={7:"Cochrane 2024, 34 études/8526 personnes : le zinc pourrait réduire la durée du rhume.",16:"Cochrane : le rinçage nasal salin a peut-être des bénéfices (moins de sécrétions et de nez bouché chez l'enfant dans un essai plus grand).",18:"Essai randomisé au Japon : se gargariser à l'eau a réduit les infections des voies respiratoires supérieures d'environ 36 %.",20:"Cochrane : un seul essai (146 personnes) — moins de rhumes avec l'ail (24 vs 65)."};
const AE=A.etudes.map((e,i)=>FIX[i]?{...e,finding_fr:FIX[i]}:e).filter((e,i)=>![0,10,19].includes(i));
const AELV=['partiel','direct','direct','direct','direct','direct','partiel','direct','direct','direct','direct','partiel','direct','direct','partiel','direct','direct','partiel','direct','lien','direct'];
// Cochrane retirées (conclusion non concluante) : rinçage nasal salin CD006821 et ail CD006206. Gardées : miel CD007094, zinc CD014914.
const GONE=['10.1002/14651858.cd006821.pub3','10.1002/14651858.cd006206.pub4'];
const ET=[...C.etudes.slice(0,12).map((e,i)=>({...e,n:i+1,g:'chaleur',lv:ELV[i]})),...AE.map((e,i)=>({...e,n:13+i,g:GID[e.groupe],lv:AELV[i]}))].filter(x=>!GONE.some(d=>(x.doi_url||'').toLowerCase().endsWith(d)))
 .concat(NE.map((e,i)=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:34+i,g:e.group,lv:e.level})))
 .concat(N2.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N3.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N4.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N5.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N6.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N7.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})))
 .concat(N8.etudes.map(e=>({title:e.title,journal:e.journal,year:e.year,finding_fr:e.finding,authors:e.authors,doi_url:e.doiUrl,url:e.pubmed,n:e.n,g:e.group,lv:e.level})));
const SAFE=x=>/^(Seuils de sécurité|Enfants \(AAP|Consulter si)/.test(x);
const NUX={chaleur:C.nuances.filter(SAFE),argent:N3.nuances,cuivre:N4.nuances.cuivre,quercetine:N5.nuances,girofle:N6.nuances,nac:N7.nuances.nac,echinacee:N7.nuances.echinacee,gingembre:N7.nuances.gingembre,
 'vitamine-c':["Vitamine C : 1 g par jour en soutien ; 2 g par jour en 2 à 3 prises en combat (double dose). Au-delà de 2 g par jour : risque de diarrhée et de calculs rénaux.","Prudence en cas de calculs rénaux ou d’hémochromatose. Enfant : dose selon l’âge, avec le pharmacien."],
 zinc:["Zinc, dose des études (adulte seulement) : pastilles d’environ 13 mg toutes les 2 à 3 heures éveillé (≈ 75 à 90 mg par jour), dans les 24 heures des premiers symptômes, 5 à 7 jours maximum.","Cette dose dépasse la limite usuelle de 40 mg par jour : seulement pour une courte durée. Peut causer nausées et goût métallique ; carence en cuivre si prolongé. Jamais plus de 100 mg par jour : aucun bénéfice de plus.",N4.zinc_cuivre,"Demander avis au pharmacien si tu prends des médicaments ou en cas de grossesse. Jamais de zinc dans le nez (spray ou gel nasal) : risque de perte de l’odorat.","Enfant : pas la dose des études ; selon le poids, avec un avis du pharmacien."],
 miel:["Miel : jamais avant 1 an. De 1 à 5 ans : 2 c. à thé ; adulte : 1 c. à soupe, 30 min avant le coucher pour la toux de nuit."],
 'vitamine-d':["Vitamine D : 1 000 à 2 000 UI tous les jours, pas de grosses doses espacées. Plafond : 4 000 UI par jour. Enfant : selon l’âge, avec un avis."]};
const url=process.argv[2];let fail=0,n=0;const S='/workspace/apps/combat-le-rhume-shots/';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const axe=async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});const v=await p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+' '+v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')));return v.length===0||v;};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 // sans mode : lien du pied de page
 await p.locator('[data-clr=lien-references]').click();await p.waitForTimeout(400);
 ok('footer link opens view',(await p.locator('main h1').first().innerText())==='Références');
 ok('166 X entries (22 + 13 chaleur + 7 autres + 31 refs-plus + 20 doses-refs + 4 argent + 12 grippe + 6 quercétine + 6 girofle + 24 NAC/échinacée/gingembre + 21 internationales)',await p.locator('[data-ref]').count()===166&&XS.length===166);
 const hrefs=(await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>a.getAttribute('href')))).sort();
 ok('166 x.com/status links = JSON exactly',hrefs.length===166&&new Set(hrefs).size===166&&hrefs.every(h=>/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(h))&&JSON.stringify(hrefs)===JSON.stringify(URLS)||hrefs);
 ok('Seheult 16 URL',hrefs.includes('https://x.com/RogerSeheult/status/1747687008888369397'));
 ok('pushback posts absent',!hrefs.some(h=>J.contradicting_or_nuance.some(c=>c.url===h)));
 const attrs=await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>[a.target,a.rel,a.textContent.trim()]));
 ok('links target _blank + noopener + label',attrs.every(([t,r,x])=>t==='_blank'&&r.includes('noopener')&&x==='Voir la publication sur X'));
 const badges=await p.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>[+l.dataset.ref,l.querySelector('[data-badge]')?.dataset.badge,l.querySelector('[data-badge]')?.textContent]));
 ok('badges present + match support level',badges.length===166&&badges.every(([i,lv,t])=>lv===LV[i-1]&&({direct:'Appuie directement',partiel:'Appuie en partie',lien:'En lien'})[lv]===t)||badges);
 ok('Rhonda Patrick: PhD, pas médecin',(await p.locator('[data-ref="22"] [data-clr=pas-medecin]').innerText())==='PhD, pas médecin'&&await p.locator('[data-clr=pas-medecin]').count()===58);
 const pm=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('[data-clr=pas-medecin]')).map(l=>[+l.dataset.ref,l.querySelector('[data-clr=pas-medecin]').textContent]));
 ok('non-médecins étiquetés honnêtement',JSON.stringify(pm.filter(x=>x[0]>42).map(x=>x[1]).sort())===JSON.stringify(['Agence de presse, pas un médecin','Anonyme, MD non vérifié','Anonyme, MD non vérifié','Association de pédiatres','Chaîne médicale (Roger Seheult, MD)','Chaîne médicale (Roger Seheult, MD)','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticien, pas médecin','Chiropraticienne, pas médecin','Fondation, pas un médecin','Hôpital, pas un médecin','Hôpital, pas un médecin','Hôpital, pas un médecin','Hôpital, pas un médecin','Hôpital, pas un médecin','Infirmière (RN), pas médecin','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','MD non vérifié','Naturopathe (ND), pas médecin','Naturopathe (ND), pas médecin','Naturopathe (ND), pas médecin','Naturopathe (ND), pas médecin','Nutritionniste, pas médecin','Pharmacien, pas médecin','Pharmacienne, pas médecin','Praticien ayurvédique, pas médecin','Praticien ayurvédique, pas médecin'])&&NP.filter(x=>x.notPhysician).length===7&&N2.posts.filter(x=>x.notPhysician).length===1&&N2.posts.find(x=>x.notPhysician).handle==='@dr_ericberg'||pm);
 const notes=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('[data-clr=ref-note]')).map(l=>+l.dataset.ref));
ok('no Mercola/McCullough notes',notes.length===0&&await p.locator('[data-clr=ref-note]').count()===0||notes);
 const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
 const grp=await p.locator('[data-ref]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[+l.dataset.ref,l.closest('[data-ref-group]').dataset.refGroup])));
 ok('7 autres X posts in their tagged group',A.x_posts.every((e,i)=>grp[36+i]===GID[e.groupe])||grp);
 const nx=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>+l.dataset.ref>35&&+l.dataset.ref<=42).map(l=>[l.querySelector('a').getAttribute('href'),l.innerText]));
 ok('autres X: URL, nom, qualification (idem résolu), extrait',nx.length===7&&nx.every(([h,tx],i)=>h===A.x_posts[i].url&&tx.includes(A.x_posts[i].name)&&tx.replace(/\s+/g,' ').includes(A.x_posts[i].excerpt.replace(/\s+/g,' '))&&!/\bidem\b/i.test(tx))||nx.map(x=>x[0]));
ok('intro',t.includes('Publications publiques de médecins sur X')&&t.includes('ne remplacent pas un avis médical')&&t.includes('166 publications et 234 études scientifiques'));
 const et=await p.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,bt:l.querySelector('[data-badge]').textContent,t:l.innerText,tg:[...l.querySelectorAll('a')].every(a=>a.target==='_blank'&&a.rel.includes('noopener'))})));
const BT={direct:'Appuie directement',partiel:'Appuie en partie',lien:'En lien'};
 const byN=Object.fromEntries(et.map(e=>[e.n,e]));
 ok('234 études (12 + 21 − 2 Cochrane + 24 + 21 + 8 argent + 28 grippe + 10 quercétine + 11 girofle + 31 NAC/échinacée/gingembre + 70 internationales), DOI + PubMed links = JSON exactly',et.length===234&&ET.length===234&&ET.every(x=>{const e=byN[x.n];return e&&e.doi===(x.doi_url??null)&&e.pm===x.url&&e.tg&&e.t.includes(x.title)&&e.t.includes(x.journal)&&e.t.includes(String(x.year))&&e.t.includes(x.finding_fr)&&e.t.includes(x.authors);})||et.map(e=>e.n));
 ok('Sanu & Eccles 2008: PubMed only',byN[31].doi===null&&byN[31].pm==='https://pubmed.ncbi.nlm.nih.gov/19145994/'&&byN[31].t.includes('Sanu'));
 ok('études badges (aucune « Nuance »)',ET.every(x=>byN[x.n].b===x.lv&&byN[x.n].bt===BT[x.lv])&&!et.some(e=>e.b==='nuance')||et.map(e=>e.n+e.b));
 const eg=await p.locator('[data-etude]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[+l.dataset.etude,l.closest('[data-ref-group]').dataset.refGroup])));
 ok('études in their tagged group',ET.every(x=>eg[x.n]===x.g)||eg);
 ok('Satomura 2005 only in Rinçage, water finding only',et.filter(e=>e.t.includes('Satomura')).length===1&&eg[29]==='rincage'&&byN[29].t.includes('environ 36 %')&&!/iode/i.test(byN[29].t));
 ok('Hemilä 2013 Cochrane vit. C absent',!et.some(e=>e.t.includes(A.etudes[0].title))&&!et.some(e=>e.doi===A.etudes[0].doi_url));
 ok('Johnson & Eccles 2005 in Chaleur',eg[33]==='chaleur'&&byN[33].doi==='https://doi.org/10.1093/fampra/cmi072'||byN[33]);
 ok('Chaleur group: 19 études, 21 X',await p.locator('#ref-chaleur [data-etude]').count()===19&&(await p.locator('#ref-chaleur-t').innerText())==='Chaleur du corps et fièvre'&&await p.locator('#ref-chaleur [data-ref]').count()===21);
 ok('Rinçage et gargarisme group',(await p.locator('#ref-rincage-t').innerText())==='Rinçage et gargarisme'&&await p.locator('#ref-rincage [data-etude]').count()===14&&await p.locator('#ref-rincage [data-ref]').count()===21);
 ok('Peroxyde group: 4 X + 4 études (3 + 1 internationale)',(await p.locator('#ref-peroxyde-t').innerText())==='Peroxyde'&&await p.locator('#ref-peroxyde [data-ref]').count()===4&&await p.locator('#ref-peroxyde [data-etude]').count()===4);
 const npx=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>+l.dataset.ref>42).map(l=>({n:+l.dataset.ref,h:l.querySelector('a').getAttribute('href'),g:l.closest('[data-ref-group]').dataset.refGroup,t:l.innerText.replace(/\s+/g,' ')})));
 ok('124 nouvelles publications (31 + 20 + 4 + 12 + 6 + 6 + 24 + 21) : URL, groupe, nom, handle, résumé, citation',npx.length===124&&[...N2.posts,...N3.posts,...N4.posts,...N5.posts,...N6.posts,...N7.posts,...N8.posts].every(x=>{const e=npx.find(y=>y.n===x.n);return e&&e.h===x.url&&e.g===x.group&&e.t.includes(x.name)&&e.t.includes(x.handle)&&e.t.includes(x.gist.replace(/\s+/g,' '))&&e.t.includes(x.quote.replace(/\s+/g,' ').slice(0,60));})&&NP.every((x,i)=>{const e=npx.find(y=>y.n===43+i);return e&&e.h===x.url&&e.g===x.group&&e.t.includes(x.name)&&e.t.includes(x.handle)&&e.t.includes(x.gist.replace(/\s+/g,' '))&&e.t.includes(x.quote.replace(/\s+/g,' ').slice(0,60));})||npx.map(x=>x.n+x.g));
 ok('Cochrane saline + ail retirées ; miel + zinc gardées',!et.some(e=>/cd006821|cd006206/i.test(e.doi||''))&&et.some(e=>/cd007094/i.test(e.doi||''))&&et.some(e=>/cd014914/i.test(e.doi||'')));
 const nu=await p.locator('[data-securite]').evaluateAll(ds=>Object.fromEntries(ds.map(d=>[d.dataset.securite,[...d.querySelectorAll('li')].map(l=>l.textContent)])));
 ok('safety boxes per group = JSON exactly (safety only)',JSON.stringify(Object.keys(nu).sort())===JSON.stringify(Object.keys(NUX).sort())&&Object.entries(NUX).every(([g,a])=>JSON.stringify(nu[g])===JSON.stringify(a))||nu);
 const allT=(await p.locator('main').textContent());
 ok('no Cochrane onset / povidone-iode comparison text',!/début du rhume : pas d|seulement au début|povidone-iode n'a pas fait mieux|aucune preuve solide trouvée contre le rhume|rapport 0,89/i.test(allT));
 const toc=await p.locator('[data-otp]').textContent();
 ok('sommaire counts include études',toc.includes('Chaleur du corps et fièvre (40)')&&toc.includes('Échinacée (34)')&&toc.includes('NAC (N-acétylcystéine) (30)')&&toc.includes('Gingembre, ail et liquides (30)')&&toc.includes('Rinçage et gargarisme (35)')&&toc.includes('Peroxyde (8)')&&toc.includes('Thym (5)')&&toc.includes('Probiotiques (9)')&&toc.includes('Argent colloïdal (17)')&&toc.includes('Zinc (27)')&&toc.includes('Cuivre (4)')&&toc.includes('Quercétine (21)')&&toc.includes('Clou de girofle (18)')&&toc.includes('Sureau (16)')&&toc.includes('Vitamine D (43)')||toc);
 ok('nothing contradicting the app',t.includes('bien documenté')&&!/\bHEAT\b|Nuance/.test(await p.locator('main').textContent())&&!/extrapolation|doubler exactement|Karsch|résultats contradictoires|preuves faibles|preuves insuffisantes|ne change pas toujours l|n'aide sans doute pas|faible qualité|ne parle pas du rhume ni de se couvrir|pas de « suer »/i.test(await p.locator('main').textContent()));
 ok('Karsch-Völk + HEAT absent',!hrefs.includes(A.etudes[10].url)&&!et.some(e=>e.pm===A.etudes[10].url||e.pm===C.etudes[12].url));
 ok('19 groups (+ Thym, Probiotiques, Argent colloïdal, Cuivre, Quercétine, Clou de girofle, NAC)',await p.locator('[data-ref-group]').count()===19);
 ok('NAC group: 12 X + 18 études (12 + 6 internationales), after Clou de girofle',(await p.locator('#ref-nac-t').innerText())==='NAC (N-acétylcystéine)'&&await p.locator('#ref-nac [data-ref]').count()===12&&await p.locator('#ref-nac [data-etude]').count()===18&&await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup).join(',')).then(x=>x.includes('girofle,nac')));
 ok('Clou de girofle group: 6 X + 12 études (11 + 1 internationale), after Quercétine, 4 sources officielles',(await p.locator('#ref-girofle-t').innerText())==='Clou de girofle'&&await p.locator('#ref-girofle [data-ref]').count()===6&&await p.locator('#ref-girofle [data-etude]').count()===12&&await p.locator('#ref-girofle [data-clr=sources-officielles] a').count()===4&&await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup).join(',')).then(x=>x.includes('quercetine,girofle')));
 ok('Clou de girofle: Kiki 2023 absent',!/Kiki MJ|molecules28062421/.test(allT));
 ok('Quercétine group: 6 X + 15 études (10 + 5 internationales), after Cuivre',(await p.locator('#ref-quercetine-t').innerText())==='Quercétine'&&await p.locator('#ref-quercetine [data-ref]').count()===6&&await p.locator('#ref-quercetine [data-etude]').count()===15&&await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup).join(',')).then(x=>x.includes('cuivre,quercetine')));
 ok('Quercétine: sources officielles (Santé Canada, Komen/NatMed, MSKCC)',N5.sources.every(o=>true)&&await p.locator('#ref-quercetine a[href="https://webprod.hc-sc.gc.ca/nhpid-bdipsn/dbImages/mono_quercetin_english.pdf"]').count()===1&&await p.locator('#ref-quercetine a[href="https://www.komen.org/breast-cancer/survivorship/complementary-therapies/quercetin/"]').count()===1&&await p.locator('#ref-quercetine a[href="https://www.mskcc.org/cancer-care/integrative-medicine/herbs/quercetin"]').count()===1);
 ok('Quercétine: Önal 2021 absent',!/Önal|biy-2104-16/.test(allT));
 ok('Cuivre group: 4 études, 0 X, after Zinc',(await p.locator('#ref-cuivre-t').innerText())==='Cuivre'&&await p.locator('#ref-cuivre [data-etude]').count()===4&&await p.locator('#ref-cuivre [data-ref]').count()===0&&await p.locator('[data-ref-group]').evaluateAll(g=>g.map(x=>x.dataset.refGroup).join(',')).then(x=>x.includes('zinc,cuivre')));
 const cuT=(await p.locator('#ref-cuivre').innerText()).replace(/\s+/g,' ');
 ok('Cuivre: Percival, Noyce, Warnes, Cortes + Sécurité NIH ODS (0,9 mg, 10 mg)',['Percival SS','Noyce JO','Warnes SL','Cortes AA'].every(a=>cuT.includes(a))&&cuT.includes('0,9 mg par jour')&&cuT.includes('10 mg de cuivre par jour')&&await p.locator('#ref-cuivre a[href="https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/"]').count()===1||cuT.slice(0,600));
 ok('exclus absents (Puchkova, Rupp, Stella Immanuel)',!/Puchkova|Rupp JC|Immanuel/.test(allT)&&!hrefs.some(h=>/stella_immanuel/i.test(h)));
 ok('zinc Sécurité: ligne cuivre (refs)',(await p.locator('[data-securite=zinc]').innerText()).includes(N4.zinc_cuivre));
 ok('Sulistyani 2022 + Burgos-Ramos 2022 absent (l’eau fait aussi bien)',!/Sulistyani|Burgos-Ramos/.test(allT)&&!et.some(e=>/f1000research\.110843|sdentj\.2022\.01\.005/i.test(e.doi||'')));
 ok('Peroxyde études : 3 + 1 internationale',await p.locator('#ref-peroxyde [data-etude]:not([data-intl])').count()===3&&await p.locator('#ref-peroxyde [data-etude][data-intl]').count()===1);
 ok('each entry: name, handle, claim, date',await p.locator('[data-ref]').evaluateAll(ls=>ls.every(l=>l.querySelector('h3')&&/@\w+/.test(l.innerText)&&l.innerText.includes('Conseil de l’appli')&&l.innerText.includes('Publié le'))));
 ok('axe références (sans mode)',await axe());
 // Mode Combat : carte remède → groupe ; Conseils → carte
 await clk('Accueil');await clk('Mode Combat');await hide();
 await p.locator('[data-ref-link=vitamine-c]').click();await p.waitForTimeout(600);
 const top=await p.locator('#ref-vitamine-c').evaluate(e=>e.getBoundingClientRect().top);
 ok('combat remedy card → Vitamine C group in view',(await p.locator('main h1').first().innerText())==='Références'&&top>=0&&top<400||top);
 ok('combat theming on refs',await p.locator('[data-clr=references] .clr-hero-combat').count()===1);
 ok('axe références (Combat)',await axe());
 if(true){await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(300);await p.screenshot({path:S+(dn==='iphone13'?'references.png':'references-desktop.png')});
   await p.locator('#ref-chaleur').evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-(document.querySelector('header').offsetHeight+8)));await p.waitForTimeout(200);await p.screenshot({path:S+(dn==='iphone13'?'chaleur-refs.png':'chaleur-refs-desktop.png')});
   await p.locator('#ref-peroxyde').evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-(document.querySelector('header').offsetHeight+8)));await p.waitForTimeout(200);await p.screenshot({path:S+'peroxyde-refs-'+dn+'.png'});
  if(dn==='iphone13'){await p.locator('#ref-cuivre').evaluate(e=>window.scrollTo({top:e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').getBoundingClientRect().bottom-8,behavior:'instant'}));await p.waitForTimeout(500);await p.screenshot({path:S+'cuivre-refs.png'});}
  await p.locator('#ref-chaleur-etudes').evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-(document.querySelector('header').offsetHeight+8)));await p.waitForTimeout(200);await p.screenshot({path:S+'chaleur-etudes-'+dn+'.png'});}
 await clk('Conseils');ok('Conseils (Combat) has Références card',await p.locator('[data-clr=carte-references]').isVisible()&&(await p.locator('[data-clr=carte-references]').innerText()).includes('166 publications publiques de médecins sur X et 234 études scientifiques'));
 await clk('Voir les références');ok('Conseils card opens refs',(await p.locator('main h1').first().innerText())==='Références');
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Conseils');
 ok('Conseils (Soutien) has Références card',await p.locator('[data-clr=carte-references]').isVisible());
 await clk('Voir les références');ok('soutien theming on refs',await p.locator('[data-clr=references] .clr-hero-soutien').count()===1);
 ok('axe références (Soutien)',await axe());
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
