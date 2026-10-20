// Peroxyde dans les oreilles : « 5 minutes maximum, ou avant si étourdissement », partout où il apparaît.
const {chromium,devices}=require('playwright');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
const NEW='Laisser agir 5 minutes maximum, ou avant si étourdissement : arrêter dès qu’un étourdissement apparaît.';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];const tag=dn;
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',tag,k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async sel=>{for(const bt of await p.locator(sel+' button[aria-expanded=false]').all())if(await bt.isVisible()){await bt.click();await p.waitForTimeout(150);}};
 const earLines=async()=>(await p.locator('main').innerText()).split('\n').filter(l=>/oreille/i.test(l)&&/peroxyde/i.test(l));
 const good=ls=>ls.length>0&&ls.every(l=>l.includes(NEW)&&!/(\d+|quelques|dix|quinze)\s*(à\s*\d+\s*)?min(ute)?s?/i.test(l.replace('5 minutes maximum','')));
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();await clk('Mode Soutien');await hide();
 // Soutien : Symptômes → Mal de gorge
 await clk('Symptômes');await hide();
 const mg=p.getByRole('button',{name:'Mal de gorge',exact:true});if(await mg.count()&&await mg.first().getAttribute('aria-pressed')==='false'){await mg.first().click();await p.waitForTimeout(300);}
 await openAll('main');
let ls=await earLines();ok('soutien symptômes mal de gorge: ear line',good(ls)||ls);
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
