const {chromium,devices}=require('playwright');
const url=process.argv[2];let fail=0,n=0;
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 await p.goto(url,{waitUntil:'networkidle'});await clk('Commencer');await clk('Mode Combat');
 const card=p.locator('#remede-miel');const ct=(await card.innerText()).replace(/\s+/g,' ');
 ok('card title Miel seul',(await card.locator('h2').first().innerText()).includes('Miel seul')&&!(await card.locator('h2').first().innerText()).includes('citron'));
 ok('card new wording',['Pour le mal de gorge, prendre seulement du miel','1 cuillère à soupe de miel seul','pas en métal (bois, plastique ou céramique)','Pas dans une tisane, pas de citron.','Ne pas rincer la gorge ni boire juste après : laisser le miel agir dans la gorge.','Jamais avant 1 an.'].every(x=>ct.includes(x))||ct);
 // « citron » / « tisane » seulement dans la consigne négative, plus aucun mélange
 const rest=ct.replace('Pas dans une tisane, pas de citron.','');
 ok('no citron/tisane mixing on Combat honey card',!/citron|tisane|eau chaude|c\. à café/i.test(rest)||rest);
 ok('Miel references link kept',await card.locator('[data-ref-link=miel]').count()===1);
 const lg=(await p.locator('main').innerText()).replace(/\s+/g,' ');
 ok('logique line',lg.includes('4. Miel cru. Miel seul : 1 c. à soupe, cuillère pas en métal. Ne pas boire juste après : laisser agir.'));
 await clk('J’ai mal à la gorge, je commence');
 const g=(await p.locator('[data-clr=protocole] [data-geste=miel]').innerText()).replace(/\s+/g,' ');
 ok('checklist act',g.includes('1 c. à soupe de miel seul, cuillère pas en métal · ne pas boire juste après')&&!/citron|tisane/i.test(g)||g);
 await clk('Enfant');const ce=(await p.locator('#remede-miel').innerText()).replace(/\s+/g,' ');
 ok('enfant dose kept + adult line',ce.includes('À partir de 1 an seulement. Jamais avant.')&&ce.includes('Adulte : Pour le mal de gorge')||ce);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
