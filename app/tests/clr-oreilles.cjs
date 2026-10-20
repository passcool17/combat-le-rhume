// Peroxyde dans les oreilles : même mélange que le gargarisme (50/50), « 5 minutes maximum, ou avant si étourdissement », partout où il apparaît ;
// + usage en prévention (accueil Soutien et Conseils), adulte seulement.
const {chromium,devices}=require('playwright');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const MIX='1 c. à soupe de peroxyde 3 % Food Grade + 1 c. à soupe d’eau (50/50)';
const PREV='Oreilles au peroxyde, en prévention (adulte) : même mélange que le gargarisme, '+MIX+'. Quelques gouttes dans chaque oreille, 5 minutes maximum, ou avant si étourdissement. Puis pencher la tête pour vider.';
const NEW='Laisser agir 5 minutes maximum, ou avant si étourdissement : arrêter dès qu’un étourdissement apparaît.';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];const tag=dn;
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',tag,k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async sel=>{for(const bt of await p.locator(sel+' button[aria-expanded=false]').all())if(await bt.isVisible()){await bt.click();await p.waitForTimeout(150);}};
 const NB=x=>x.replace(/\u00a0/g,' ');
 const earLines=async()=>NB(await p.locator('main').innerText()).split('\n').filter(l=>/oreille/i.test(l)&&/peroxyde/i.test(l)&&!l.startsWith('Oreilles au peroxyde, en prévention'));
 const good=ls=>ls.length>0&&ls.every(l=>l.includes(NEW)&&l.includes('Même mélange que le gargarisme : '+MIX+', quelques gouttes dans chaque oreille.')&&!/moitié eau/.test(l)&&!/(\d+|quelques|dix|quinze)\s*(à\s*\d+\s*)?min(ute)?s?/i.test(l.replace('5 minutes maximum','')));
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();await clk('Mode Soutien');await hide();
 // Soutien : Symptômes → Mal de gorge
 await clk('Symptômes');await hide();
 const mg=p.getByRole('button',{name:'Mal de gorge',exact:true});if(await mg.count()&&await mg.first().getAttribute('aria-pressed')==='false'){await mg.first().click();await p.waitForTimeout(300);}
 await openAll('main');
let ls=await earLines();ok('soutien symptômes mal de gorge: ear line',good(ls)||ls);
 // Soutien : prévention sur l’accueil et dans Conseils
 const prevLine=async()=>{const l=p.locator('[data-prevention=oreilles]');return (await l.count())?NB(await l.first().innerText()):null;};
 await clk('Accueil');await hide();
 {const pv=p.locator('#prevention button[aria-expanded=false]');if(await pv.count()){await pv.first().click();await p.waitForTimeout(250);}}
 let pl=await prevLine();ok('soutien accueil prévention: ear line',!!pl&&pl.includes(PREV)||pl);
 ok('prévention: 3 % Food Grade nbsp',await p.locator('[data-prevention=oreilles]').evaluate(e=>e.textContent.includes('3\u00a0%\u00a0Food\u00a0Grade')));
 ok('prévention: last item of the list',await p.locator('#prevention li').last().getAttribute('data-prevention')==='oreilles');
 if(dn==='iphone13'){await p.addStyleTag({content:'header,nav.fixed{visibility:hidden!important}'});await p.waitForTimeout(150);const r=await p.evaluate(()=>{const li=document.querySelector('[data-prevention=oreilles]');const sec=li.closest('section')||li.parentElement.parentElement;const a=sec.getBoundingClientRect();return [a.top+scrollY,a.bottom+scrollY];});await p.screenshot({path:S+'oreilles-prevention.png',fullPage:true,clip:{x:0,y:r[0]-16,width:390,height:r[1]-r[0]+32}});await p.evaluate(()=>document.querySelectorAll('style').forEach(s=>s.textContent.includes('nav.fixed{visibility')&&s.remove()));}
 await clk('Enfant');await p.waitForTimeout(300);
 ok('enfant: prévention ear line hidden (accueil)',await p.locator('[data-prevention=oreilles]').count()===0&&await p.locator('#prevention li').count()>0);
 await clk('Conseils');await p.waitForTimeout(400);
 ok('enfant: prévention ear line hidden (conseils)',await p.locator('[data-prevention=oreilles]').count()===0);
 await clk('Adulte');await p.waitForTimeout(300);
 pl=await prevLine();ok('soutien conseils prévention: ear line',!!pl&&pl.includes(PREV)||pl);
 // Combat : Remèdes (gorge et tous)
 await clk('Accueil');await hide();await clk('Mode Combat');await hide();
 const tous=p.getByRole('button',{name:/^Tous/});if(await tous.count()){await tous.first().click();await p.waitForTimeout(300);}
 await openAll('#remede-peroxyde');
 ok('combat: peroxyde card shown',await p.locator('#remede-peroxyde').count()===1);
 ls=await earLines();ok('combat remèdes: ear line',good(ls)||ls);
 if(dn==='iphone13'){await p.evaluate(()=>{const e=[...document.querySelectorAll('#remede-peroxyde p')].find(x=>/oreilles/i.test(x.textContent));e.scrollIntoView({block:'center'});});await p.waitForTimeout(300);await p.screenshot({path:S+'oreilles-5min.png'});}
 // Enfant : fiche peroxyde retirée → aucune consigne oreilles au peroxyde affichée sans la durée
 await clk('Enfant');await p.waitForTimeout(300);
 ls=await earLines();ok('enfant: no ear-peroxide line without the 5-min limit',ls.every(l=>l.includes(NEW)||/jeune enfant/i.test(l))||ls);
 ok('no console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})();
