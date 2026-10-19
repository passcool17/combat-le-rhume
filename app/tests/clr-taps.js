// liste les cibles tactiles < 44px sur plusieurs écrans. usage: node clr-taps.js <url>
const {chromium,devices}=require('playwright');
const MEASURE=()=>{const out=[];const els=[...document.querySelectorAll('button,a[href],input,select,textarea,[role=button],summary')];
 for(const el of els){if(el.closest('[hidden]'))continue;const cs=getComputedStyle(el);if(cs.visibility==='hidden'||cs.display==='none')continue;
  if(el.matches('input[type=file]')||el.classList.contains('sr-only'))continue;let t=el;
  if(el.matches('input')&&el.closest('label'))t=el.closest('label');
  const r=t.getBoundingClientRect();if(r.width===0&&r.height===0)continue;
  if(el.matches('textarea'))continue;
  if(r.width<43.5||r.height<43.5)out.push(`${Math.round(r.width)}x${Math.round(r.height)} <${el.tagName.toLowerCase()}> ${(el.innerText||el.getAttribute('aria-label')||el.value||'').trim().slice(0,40)}`)}return out};
module.exports={MEASURE};
if(require.main===module)(async()=>{const url=process.argv[2];const b=await chromium.launch();
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){const c=await b.newContext({...opt,locale:'fr-CA'});await c.grantPermissions(['notifications'],{origin:new URL(url).origin});const p=await c.newPage();
 const click=async(n,o={})=>{const l=p.getByRole('button',{name:n,exact:typeof n==='string'});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(200);return}console.log('  (no',n,')')};
 const openAll=async()=>{for(const h of await p.$$('main button[aria-expanded=false]'))if(await h.isVisible()){await h.click();await p.waitForTimeout(30)}};
 const rep=async n=>{const r=[...new Set(await p.evaluate(MEASURE))];console.log(dn,n,r.length?'\n   '+r.join('\n   '):'OK')};
 await p.goto(url,{waitUntil:'networkidle'});await rep('onboarding');await click('Commencer');await rep('chooser');
 await click('Mode Soutien');await openAll();await click('Lire la suite');await rep('soutien-open');
 for(const t of ['Symptômes','Remèdes','Plantes','Recettes']){await click(t);await openAll();if(t==='Recettes'){const v=p.getByRole('button',{name:/Voir|Ouvrir/});if(await v.count())await v.first().click()}if(t==='Symptômes'){await click('Fatigue')}await rep(t)}
 await click('Conseils');await rep('conseils');await click('Suivi');await rep('suivi');
 await click('Accueil');await click('Mode Combat');await click('J’ai mal à la gorge, je commence');await click('Intervalles et rappels');await rep('combat-remedes');
 await click('Suivi');await click('Difficulté à respirer');await click(/^Enregistrer \(/);await rep('combat-suivi-urgent');await click('Accueil');await rep('combat-accueil');await click('Conseils');await rep('combat-conseils');
 await c.close()}await b.close()})();
