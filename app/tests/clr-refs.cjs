const {chromium,devices}=require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const J=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs.json','utf8'));
const C=J.chaleur_corps;const A=J.autres_refs;const XS=[...J.entries,...C.x_posts,...A.x_posts];const URLS=XS.map(e=>e.url).sort();
const lv=s=>{s=s.toLowerCase();return s.startsWith('appuie directement')?'direct':s.startsWith('partiel')?'partiel':s.startsWith('lié')?'lien':null;};
// niveaux des nouvelles publications « appuie (réserve) » décidés à l'ajout : X4 partiel, X5 direct
// chaleur : 12 études (HEAT retiré, demande de l'utilisateur : rien qui contredise l'appli)
const ELV=['direct','direct','partiel','partiel','direct','direct','partiel','partiel','partiel','lien','partiel','direct'];
// autres_refs X1–X7 : décidés à l'ajout (« appuie (réserve) » → partiel, « en lien » → lien)
const LV=XS.map((e,i)=>({25:'partiel',26:'direct',35:'direct',36:'partiel',37:'partiel',38:'partiel',39:'partiel',40:'partiel',41:'lien'})[i]??lv(e.support));
const GID={'Vitamine C':'vitamine-c','Miel':'miel','Zinc':'zinc','Sureau':'sureau','Échinacée':'echinacee','Vitamine D':'vitamine-d','Sommeil et repos':'sommeil','Rinçage et gargarisme':'rincage','Sprays et kit':'sprays','Gingembre/ail/liquides':'gingembre','Chaleur du corps et fièvre':'chaleur'};
// autres : 21 études. Retirées : Hemilä 2013 Cochrane (i0), Karsch-Völk 2014 (i10), Satomura 2005 dans Sprays (i19).
// Gardées avec seulement leur partie qui appuie l'appli : Nault 2024 (i7), King 2015 (i16), Satomura 2005 eau (i18), Lissiman 2014 ail (i20).
const FIX={7:"Cochrane 2024, 34 études/8526 personnes : le zinc pourrait réduire la durée du rhume.",16:"Cochrane : le rinçage nasal salin a peut-être des bénéfices (moins de sécrétions et de nez bouché chez l'enfant dans un essai plus grand).",18:"Essai randomisé au Japon : se gargariser à l'eau a réduit les infections des voies respiratoires supérieures d'environ 36 %.",20:"Cochrane : un seul essai (146 personnes) — moins de rhumes avec l'ail (24 vs 65)."};
const AE=A.etudes.map((e,i)=>FIX[i]?{...e,finding_fr:FIX[i]}:e).filter((e,i)=>![0,10,19].includes(i));
const AELV=['partiel','direct','direct','direct','direct','direct','partiel','direct','direct','direct','direct','partiel','direct','direct','partiel','direct','direct','partiel','direct','lien','direct'];
const ET=[...C.etudes.slice(0,12).map((e,i)=>({...e,n:i+1,g:'chaleur',lv:ELV[i]})),...AE.map((e,i)=>({...e,n:13+i,g:GID[e.groupe],lv:AELV[i]}))];
const SAFE=x=>/^(Seuils de sécurité|Enfants \(AAP|Consulter si)/.test(x);
const NUX={zinc:[A.nuances[2]],chaleur:C.nuances.filter(SAFE)};
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
 ok('42 X entries (22 + 13 chaleur + 7 autres)',await p.locator('[data-ref]').count()===42&&XS.length===42);
 const hrefs=(await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>a.getAttribute('href')))).sort();
 ok('42 x.com/status links = JSON exactly',hrefs.length===42&&hrefs.every(h=>/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(h))&&JSON.stringify(hrefs)===JSON.stringify(URLS)||hrefs);
 ok('Seheult 16 URL',hrefs.includes('https://x.com/RogerSeheult/status/1747687008888369397'));
 ok('pushback posts absent',!hrefs.some(h=>J.contradicting_or_nuance.some(c=>c.url===h)));
 const attrs=await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>[a.target,a.rel,a.textContent.trim()]));
 ok('links target _blank + noopener + label',attrs.every(([t,r,x])=>t==='_blank'&&r.includes('noopener')&&x==='Voir la publication sur X'));
 const badges=await p.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>[+l.dataset.ref,l.querySelector('[data-badge]')?.dataset.badge,l.querySelector('[data-badge]')?.textContent]));
 ok('badges present + match support level',badges.length===42&&badges.every(([i,lv,t])=>lv===LV[i-1]&&({direct:'Appuie directement',partiel:'Appuie en partie',lien:'En lien'})[lv]===t)||badges);
 ok('Rhonda Patrick: PhD, pas médecin',(await p.locator('[data-ref="22"] [data-clr=pas-medecin]').innerText())==='PhD, pas médecin'&&await p.locator('[data-clr=pas-medecin]').count()===1);
 const notes=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('[data-clr=ref-note]')).map(l=>+l.dataset.ref));
ok('no Mercola/McCullough notes',notes.length===0&&await p.locator('[data-clr=ref-note]').count()===0||notes);
 const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
 const grp=await p.locator('[data-ref]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[+l.dataset.ref,l.closest('[data-ref-group]').dataset.refGroup])));
 ok('7 autres X posts in their tagged group',A.x_posts.every((e,i)=>grp[36+i]===GID[e.groupe])||grp);
 const nx=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>+l.dataset.ref>35).map(l=>[l.querySelector('a').getAttribute('href'),l.innerText]));
 ok('autres X: URL, nom, qualification (idem résolu), extrait',nx.length===7&&nx.every(([h,tx],i)=>h===A.x_posts[i].url&&tx.includes(A.x_posts[i].name)&&tx.replace(/\s+/g,' ').includes(A.x_posts[i].excerpt.replace(/\s+/g,' '))&&!/\bidem\b/i.test(tx))||nx.map(x=>x[0]));
ok('intro',t.includes('Publications publiques de médecins sur X')&&t.includes('ne remplacent pas un avis médical')&&t.includes('42 publications et 33 études scientifiques'));
 const et=await p.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href')??null,pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,bt:l.querySelector('[data-badge]').textContent,t:l.innerText,tg:[...l.querySelectorAll('a')].every(a=>a.target==='_blank'&&a.rel.includes('noopener'))})));
const BT={direct:'Appuie directement',partiel:'Appuie en partie',lien:'En lien'};
 const byN=Object.fromEntries(et.map(e=>[e.n,e]));
 ok('33 études (12 + 21), DOI + PubMed links = JSON exactly',et.length===33&&ET.length===33&&ET.every(x=>{const e=byN[x.n];return e&&e.doi===(x.doi_url??null)&&e.pm===x.url&&e.tg&&e.t.includes(x.title)&&e.t.includes(x.journal)&&e.t.includes(String(x.year))&&e.t.includes(x.finding_fr)&&e.t.includes(x.authors);})||et.map(e=>e.n));
 ok('Sanu & Eccles 2008: PubMed only',byN[31].doi===null&&byN[31].pm==='https://pubmed.ncbi.nlm.nih.gov/19145994/'&&byN[31].t.includes('Sanu'));
 ok('études badges (aucune « Nuance »)',ET.every(x=>byN[x.n].b===x.lv&&byN[x.n].bt===BT[x.lv])&&!et.some(e=>e.b==='nuance')||et.map(e=>e.n+e.b));
 const eg=await p.locator('[data-etude]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[+l.dataset.etude,l.closest('[data-ref-group]').dataset.refGroup])));
 ok('études in their tagged group',ET.every(x=>eg[x.n]===x.g)||eg);
 ok('Satomura 2005 only in Rinçage, water finding only',et.filter(e=>e.t.includes('Satomura')).length===1&&eg[29]==='rincage'&&byN[29].t.includes('environ 36 %')&&!/iode/i.test(byN[29].t));
 ok('Hemilä 2013 Cochrane vit. C absent',!et.some(e=>e.t.includes(A.etudes[0].title))&&!et.some(e=>e.doi===A.etudes[0].doi_url));
 ok('Johnson & Eccles 2005 in Chaleur',eg[33]==='chaleur'&&byN[33].doi==='https://doi.org/10.1093/fampra/cmi072'||byN[33]);
 ok('Chaleur group: 14 études, 17 X',await p.locator('#ref-chaleur [data-etude]').count()===13&&(await p.locator('#ref-chaleur-t').innerText())==='Chaleur du corps et fièvre'&&await p.locator('#ref-chaleur [data-ref]').count()===17);
 ok('Rinçage et gargarisme group',(await p.locator('#ref-rincage-t').innerText())==='Rinçage et gargarisme'&&await p.locator('#ref-rincage [data-etude]').count()===3);
 const nu=await p.locator('[data-securite]').evaluateAll(ds=>Object.fromEntries(ds.map(d=>[d.dataset.securite,[...d.querySelectorAll('li')].map(l=>l.textContent)])));
 ok('safety boxes per group = JSON exactly (safety only)',JSON.stringify(Object.keys(nu).sort())===JSON.stringify(Object.keys(NUX).sort())&&Object.entries(NUX).every(([g,a])=>JSON.stringify(nu[g])===JSON.stringify(a))||nu);
 const allT=(await p.locator('main').textContent());
 ok('no Cochrane onset / povidone-iode comparison text',!/début du rhume : pas d|seulement au début|povidone-iode n'a pas fait mieux|aucune preuve solide trouvée contre le rhume|rapport 0,89/i.test(allT));
 const toc=await p.locator('[data-otp]').textContent();
 ok('sommaire counts include études',toc.includes('Chaleur du corps et fièvre (30)')&&toc.includes('Échinacée (2)')&&toc.includes('Rinçage et gargarisme (3)')||toc);
 ok('nothing contradicting the app',t.includes('bien documenté')&&!/\bHEAT\b|Nuance/.test(await p.locator('main').textContent())&&!/extrapolation|doubler exactement|Karsch|résultats contradictoires|preuves faibles|preuves insuffisantes|ne change pas toujours l|n'aide sans doute pas|faible qualité|ne parle pas du rhume ni de se couvrir|pas de « suer »/i.test(await p.locator('main').textContent()));
 ok('Karsch-Völk + HEAT absent',!hrefs.includes(A.etudes[10].url)&&!et.some(e=>e.pm===A.etudes[10].url||e.pm===C.etudes[12].url));
 ok('11 groups',await p.locator('[data-ref-group]').count()===11);
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
   await p.locator('#ref-chaleur-etudes').evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-(document.querySelector('header').offsetHeight+8)));await p.waitForTimeout(200);await p.screenshot({path:S+'chaleur-etudes-'+dn+'.png'});}
 await clk('Conseils');ok('Conseils (Combat) has Références card',await p.locator('[data-clr=carte-references]').isVisible()&&(await p.locator('[data-clr=carte-references]').innerText()).includes('42 publications publiques de médecins sur X et 33 études scientifiques'));
 await clk('Voir les références');ok('Conseils card opens refs',(await p.locator('main h1').first().innerText())==='Références');
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Conseils');
 ok('Conseils (Soutien) has Références card',await p.locator('[data-clr=carte-references]').isVisible());
 await clk('Voir les références');ok('soutien theming on refs',await p.locator('[data-clr=references] .clr-hero-soutien').count()===1);
 ok('axe références (Soutien)',await axe());
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
