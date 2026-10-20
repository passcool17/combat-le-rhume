const {chromium,devices}=require('playwright');
const url=process.argv[2];let fail=0;const S='/workspace/apps/combat-le-rhume-shots/';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{console.log(v===true?'ok  ':'FAIL',dn,k);if(v!==true)fail++;};
 await p.goto(url,{waitUntil:'networkidle'});
 const clk=async n=>{const l=p.getByRole('button',{name:n,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(300);return;}throw new Error('no '+n);};
 await clk('Commencer');await clk('Mode Combat');
 const hide=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await hide.count()&&await hide.first().isVisible())await hide.first().click();
 await p.waitForTimeout(400);
 ok('h1 Mode Combat',(await p.locator('main h1').first().innerText())==='Mode Combat');
 const card=p.locator('#remede-vitamine-c-double');
 ok('remedy card visible',await card.isVisible());
 const ct=(await card.innerText()).replace(/\s+/g,' ');
 ok('card dose text',ct.includes('doubler la dose : 2 g par jour (1 g → 2 g), en 2 à 3 prises')&&ct.includes('Ne pas dépasser 2 g par jour chez l’adulte : au-delà, risque de diarrhée et de calculs rénaux.')&&!/500 mg → 1000 mg|2000 mg/.test(ct));
 ok('card precautions (hémochromatose)',ct.includes('hémochromatose')&&ct.includes('pharmacien'));
 ok('precaution not duplicated',ct.split('hémochromatose').length===2);
 ok('logique 5.',(await p.locator('main').innerText()).includes('5. Double dose de vitamine C'));
 const start=p.getByRole('button',{name:'J’ai mal à la gorge, je commence'});for(let i=0;i<await start.count();i++)if(await start.nth(i).isVisible()){await start.nth(i).click();break;}
 await p.waitForTimeout(400);
 const g=p.locator('[data-clr=protocole] [data-geste="vitamine-c-double"]');
 ok('geste in checklist',await g.isVisible()&&(await g.innerText()).includes('5. Double dose de vitamine C'));
 await p.getByRole('button',{name:'Double dose de vitamine C : j’ai pris'}).click();await p.waitForTimeout(300);
 ok('geste check',(await g.innerText()).includes('aujourd’hui : 1 fois'));
 ok('kit item',(await p.locator('[data-clr=kit]').innerText()).includes('Vitamine C (comprimés)'));
 ok('subtitle cinq gestes',(await p.locator('main h1 + p').first().innerText()).includes('Les cinq gestes'));
 await g.scrollIntoViewIfNeeded();
 await p.screenshot({path:S+(dn==='iphone13'?'vitamine-c.png':'vitamine-c-desktop.png')});
 await card.scrollIntoViewIfNeeded();await p.screenshot({path:S+(dn==='iphone13'?'vitamine-c-fiche.png':'vitamine-c-fiche-desktop.png')});
 ok('0 console errors',errs.length===0||errs.join(' | '));
 await ctx.close();}
await b.close();console.log('failures',fail);})();
