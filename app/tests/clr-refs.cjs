const {chromium,devices}=require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const J=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-refs.json','utf8'));
const C=J.chaleur_corps;const XS=[...J.entries,...C.x_posts];const URLS=XS.map(e=>e.url).sort();
const lv=s=>{s=s.toLowerCase();return s.startsWith('appuie directement')?'direct':s.startsWith('partiel')?'partiel':s.startsWith('lié')?'lien':null;};
// niveaux des nouvelles publications « appuie (réserve) » décidés à l'ajout : X4 partiel, X5 direct
const LV=XS.map((e,i)=>lv(e.support)??({25:'partiel',26:'direct'})[i]);
const ELV=['direct','direct','partiel','partiel','direct','direct','partiel','partiel','partiel','lien','partiel','direct','nuance'];
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
 ok('35 X entries (22 + 13 chaleur)',await p.locator('[data-ref]').count()===35);
 const hrefs=(await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>a.getAttribute('href')))).sort();
 ok('35 x.com/status links = JSON exactly',hrefs.length===35&&hrefs.every(h=>/^https:\/\/x\.com\/[^/]+\/status\/\d+$/.test(h))&&JSON.stringify(hrefs)===JSON.stringify(URLS)||hrefs);
 ok('Seheult 16 URL',hrefs.includes('https://x.com/RogerSeheult/status/1747687008888369397'));
 ok('pushback posts absent',!hrefs.some(h=>J.contradicting_or_nuance.some(c=>c.url===h)));
 const attrs=await p.locator('[data-ref] a').evaluateAll(as=>as.map(a=>[a.target,a.rel,a.textContent.trim()]));
 ok('links target _blank + noopener + label',attrs.every(([t,r,x])=>t==='_blank'&&r.includes('noopener')&&x==='Voir la publication sur X'));
 const badges=await p.locator('[data-ref]').evaluateAll(ls=>ls.map(l=>[+l.dataset.ref,l.querySelector('[data-badge]')?.dataset.badge,l.querySelector('[data-badge]')?.textContent]));
 ok('badges present + match support level',badges.length===35&&badges.every(([i,lv,t])=>lv===LV[i-1]&&({direct:'Appuie directement',partiel:'Appuie en partie',lien:'En lien'})[lv]===t)||badges);
 ok('Rhonda Patrick: PhD, pas médecin',(await p.locator('[data-ref="22"] [data-clr=pas-medecin]').innerText())==='PhD, pas médecin'&&await p.locator('[data-clr=pas-medecin]').count()===1);
 const notes=await p.locator('[data-ref]').evaluateAll(ls=>ls.filter(l=>l.querySelector('[data-clr=ref-note]')).map(l=>+l.dataset.ref));
 ok('notes Mercola (FDA 2021) + McCullough (MedPage)',JSON.stringify(notes.sort((a,b)=>a-b))==='[7,8,9,10,11,19,20]'&&(await p.locator('[data-ref="7"] [data-clr=ref-note]').innerText()).includes('FDA')&&(await p.locator('[data-ref="19"] [data-clr=ref-note]').innerText()).includes('MedPage Today')||notes);
 const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
 ok('intro + honest gap note',t.includes('Publications publiques de médecins sur X')&&t.includes('ne remplacent pas un avis médical')&&t.includes('de doubler exactement la vitamine C'));
 const et=await p.locator('[data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]').getAttribute('href'),pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,bt:l.querySelector('[data-badge]').textContent,t:l.innerText,tg:[...l.querySelectorAll('a')].every(a=>a.target==='_blank'&&a.rel.includes('noopener'))})));
 ok('13 études, DOI + PubMed links = JSON exactly',et.length===13&&et.every((e,i)=>e.doi===C.etudes[i].doi_url&&e.pm===C.etudes[i].url&&e.tg&&e.t.includes(C.etudes[i].title)&&e.t.includes(C.etudes[i].journal)&&e.t.includes(C.etudes[i].year)&&e.t.includes(C.etudes[i].finding_fr)&&e.t.includes(C.etudes[i].authors))||et.map(e=>e.n));
 ok('études badges (HEAT = Nuance)',et.every((e,i)=>e.b===ELV[i])&&et[12].bt==='Nuance'&&et[12].t.includes('HEAT')||et.map(e=>e.b));
 ok('études inside Chaleur du corps et fièvre group',await p.locator('#ref-chaleur [data-etude]').count()===13&&(await p.locator('#ref-chaleur-t').innerText())==='Chaleur du corps et fièvre'&&await p.locator('#ref-chaleur [data-ref]').count()===17);
 ok('nuances box (6)',await p.locator('#ref-chaleur [data-clr=nuances-chaleur] li').count()===6);
 ok('gap note updated',t.includes('aucune source ne teste directement le fait de bien se couvrir la nuit')&&t.includes('bien documenté'));
 ok('10 groups',await p.locator('[data-ref-group]').count()===10);
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
 await clk('Conseils');ok('Conseils (Combat) has Références card',await p.locator('[data-clr=carte-references]').isVisible());
 await clk('Voir les références');ok('Conseils card opens refs',(await p.locator('main h1').first().innerText())==='Références');
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Conseils');
 ok('Conseils (Soutien) has Références card',await p.locator('[data-clr=carte-references]').isVisible());
 await clk('Voir les références');ok('soutien theming on refs',await p.locator('[data-clr=references] .clr-hero-soutien').count()===1);
 ok('axe références (Soutien)',await axe());
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
