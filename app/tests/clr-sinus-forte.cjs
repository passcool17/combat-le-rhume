// Fiche « Nettoyage des sinus » : recette « La plus forte » (peroxyde 3 % Food Grade), après « la plus douce », cachée en profil Enfant.
const {chromium,devices}=require('playwright');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 for(const theme of ['clair','sombre']){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];const tag=dn+'/'+theme;
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',tag,k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openSinus=async()=>{await clk('Recettes');await hide();const h=p.locator('#prep-sinus button');if(await h.getAttribute('aria-expanded')!=='true')await h.click();await p.waitForTimeout(300);};
 await p.goto(url,{waitUntil:'networkidle'});await hide();
 if(theme==='sombre')await clk('Passer en mode sombre');
 await clk('Commencer');await hide();await clk('Mode Soutien');await hide();
 await openSinus();
 const card=p.locator('[data-block="La plus forte"]');
 ok('forte card present',await card.count()===1&&await card.isVisible());
 const titles=await p.locator('[data-block]').evaluateAll(ls=>ls.map(l=>l.dataset.block));
 ok('order douce → forte → conseils',JSON.stringify(titles)===JSON.stringify(['Solution saline, la plus douce','La plus forte','Conseils d’usage'])||titles);
 const t=await card.innerText();
 ok('ingredient peroxyde 3 % Food Grade',t.includes('¼ c. à café de peroxyde d’hydrogène 3 % Food Grade (jamais le 35 %)'));
 ok('ingredient eau 177 ml',t.includes('177 ml (¾ tasse) d’eau tiède, bouillie ou filtrée'));
 ok('method',t.includes('Mélanger. Pot neti, seringue ou flacon spray. Incliner la tête, faire passer d’une narine à l’autre, puis se moucher doucement. Ne pas avaler.'));
 const [c1,c2]=await p.evaluate(()=>[...document.querySelectorAll('[data-block]')].slice(0,2).map(e=>e.className));
 ok('same style as douce card',c1===c2||[c1,c2]);
 ok('no "pas de peroxyde dans le nez" left',!/pas de peroxyde dans le nez|pas dans le nez/i.test(await p.locator('body').innerText()));
 if(dn==='iphone13'&&theme==='clair'){await card.scrollIntoViewIfNeeded();await p.evaluate(()=>{const e=document.querySelector('[data-block="La plus forte"]');e.scrollIntoView({block:'start'});window.scrollBy(0,-235);});await p.waitForTimeout(300);await p.screenshot({path:S+'sinus-forte.png'});}
 if(dn==='iphone13'&&theme==='sombre'){await p.evaluate(()=>{const e=document.querySelector('[data-block="La plus forte"]');e.scrollIntoView({block:'start'});window.scrollBy(0,-235);});await p.waitForTimeout(300);await p.screenshot({path:S+'sinus-forte-dark.png'});}
 await clk('Enfant');await p.waitForTimeout(300);
 if(await p.locator('#prep-sinus button').getAttribute('aria-expanded')!=='true')await p.locator('#prep-sinus button').click();
 ok('enfant: forte hidden',await p.locator('[data-block="La plus forte"]').count()===0&&await p.locator('[data-block="Solution saline, la plus douce"]').count()===1);
 await clk('Adulte');await p.waitForTimeout(300);
 ok('adulte: forte back',await p.locator('[data-block="La plus forte"]').count()===1);
 ok('no console errors',errs.length===0||errs);
 await ctx.close();}}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})();
