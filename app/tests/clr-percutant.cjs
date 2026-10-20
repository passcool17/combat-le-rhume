const {chromium,devices}=require('playwright');const fs=require('fs');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const url=process.argv[2];let fail=0,n=0;const S='/workspace/apps/combat-le-rhume-shots/';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 for(const theme of ['clair','sombre']){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];const tag=dn+'/'+theme;
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',tag,k,v===true?'':JSON.stringify(v));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const axe=async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});return p.evaluate(async()=>(await axe.run(document,{resultTypes:['violations']})).violations.map(v=>v.id+' '+v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')));};
 const shot=async f=>{if(theme==='clair')await p.screenshot({path:S+f});};
 await p.goto(url,{waitUntil:'networkidle'});await hide();
 if(theme==='sombre')await clk('Passer en mode sombre');
 ok('onboarding: combat card striking (gradient)',(await p.locator('[data-mode-card=combat]').evaluate(e=>getComputedStyle(e).backgroundImage)).includes('gradient'));
 await clk('Commencer');await hide();
 const cb=p.getByRole('button',{name:'Mode Combat',exact:true}).first();
 ok('chooser: names intact + described',await cb.isVisible()&&(await cb.getAttribute('aria-describedby'))==='choix-combat-d');
 ok('chooser: taglines',(await p.locator('[data-clr=choix-mode]').innerText()).includes('On part à la guerre contre la zone infectée')&&(await p.locator('[data-clr=choix-mode]').innerText()).includes('L’équipe de soutien de ton système immunitaire'));
 ok('axe accueil (choix)',JSON.stringify(await axe())==='[]'||await axe());
 if(dn==='iphone13')await shot('percutant-accueil.png');
 await clk('Mode Combat');await hide();
 ok('html.mode-combat',await p.evaluate(()=>document.documentElement.classList.contains('mode-combat')));
 ok('combat hero',(await p.locator('[data-clr=hero-combat]').innerText()).includes('ON PART À LA GUERRE CONTRE LA ZONE INFECTÉE')&&(await p.locator('main h1').first().innerText())==='Mode Combat');
 const t=(await p.locator('main').innerText()).replace(/\s+/g,' ');
 ok('mission copy',['PLAN D’ATTAQUE · 3 JOURS','ORDRES DE MISSION','ARSENAL · À PRÉPARER D’AVANCE','Kit Combat','Logique des remèdes prioritaires','QUAND ARRÊTER ET CONSULTER','Info-Santé : 811'].every(x=>t.includes(x))||['PLAN D’ATTAQUE · 3 JOURS','ORDRES DE MISSION','ARSENAL · À PRÉPARER D’AVANCE','QUAND ARRÊTER ET CONSULTER'].filter(x=>!t.includes(x)));
 const pulse=await p.locator('.clr-pulse').first().evaluate(e=>getComputedStyle(e).animationName);
 ok('CTA pulse',pulse==='clr-pulse');
 ok('axe combat (avant protocole)',JSON.stringify(await axe())==='[]'||await axe());
 await clk('J’ai mal à la gorge, je commence');
 const pr=(await p.locator('[data-clr=protocole]').innerText()).replace(/\s+/g,' ');
 ok('protocol: plan d’attaque + phase + armes',pr.includes('PLAN D’ATTAQUE EN COURS')&&pr.includes('Jour 1 sur 3')&&pr.includes('JOUR 1 : FRAPPE IMMÉDIATE')&&pr.includes('Tes armes du jour')&&pr.includes('5. Double dose de vitamine C'));
 ok('night 1 assault kicker + content intact',pr.includes('L’ASSAUT DE CHALEUR')&&pr.includes('Nuit 1 : la plus importante — faire monter la chaleur du corps')&&pr.includes('39 °C ou plus'));
 ok('axe combat (protocole)',JSON.stringify(await axe())==='[]'||await axe());
 if(theme==='clair'){await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(200);await p.screenshot({path:S+(dn==='iphone13'?'percutant-combat.png':'percutant-combat-desktop.png')});
   if(dn==='iphone13'){await p.locator('[data-clr=protocole]').evaluate(e=>e.scrollIntoView({block:'start'}));await p.evaluate(()=>window.scrollBy(0,-230));await p.waitForTimeout(200);await p.screenshot({path:S+'percutant-combat-protocole.png'});}}
 await clk('Passer au Mode Soutien');await hide();
 ok('html.mode-soutien',await p.evaluate(()=>document.documentElement.classList.contains('mode-soutien')&&!document.documentElement.classList.contains('mode-combat')));
 ok('soutien hero calm',(await p.locator('main h1').first().innerText())==='Mode Soutien'&&(await p.locator('[data-clr=hero-soutien]').innerText()).includes('L’ÉQUIPE DE SOUTIEN')&&(await p.locator('main').innerText()).includes('Renforts, ravitaillement et récupération'));
 const [cc,sc]=await p.evaluate(()=>{const s=getComputedStyle(document.documentElement);return [s.getPropertyValue('--combat-600'),s.getPropertyValue('--color-primary')];});
 ok('soutien primary is teal, not combat red',sc.trim()!==cc.trim());
 ok('axe soutien (remèdes)',JSON.stringify(await axe())==='[]'||await axe());
 await clk('Accueil');await hide();
 ok('soutien home: équipe card',(await p.locator('[data-clr=soutien-equipe]').innerText()).includes('L’équipe de soutien de ton système immunitaire'));
 ok('axe soutien (accueil)',JSON.stringify(await axe())==='[]'||await axe());
 if(dn==='iphone13'&&theme==='clair'){await clk('Remèdes');await hide();await p.evaluate(()=>window.scrollTo(0,0));await p.waitForTimeout(200);await p.screenshot({path:S+'percutant-soutien.png'});}
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}}
// reduced motion
const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await ctx.newPage();await p.goto(url,{waitUntil:'networkidle'});
await p.getByRole('button',{name:'Commencer',exact:true}).click();await p.getByRole('button',{name:'Mode Combat',exact:true}).first().click();await p.waitForTimeout(300);
const an=await p.locator('.clr-pulse').first().evaluate(e=>getComputedStyle(e).animationName);n++;if(an!=='none'){fail++;console.log('FAIL reduced-motion',an)}else console.log('ok   reduced-motion: no pulse');
await b.close();console.log('checks',n,'failures',fail);})().catch(e=>{console.error(e);process.exit(1)});
