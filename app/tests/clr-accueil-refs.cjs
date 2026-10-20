// Bloc Références de l'accueil : chiffres, publications mises en avant (direct, sans Cochrane), boutons, a11y, 44 px, thèmes.
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const AXE=fs.readFileSync(require.resolve('axe-core/axe.min.js'),'utf8');
const SRC=path.join(__dirname,'..','src','data','references.js');
const arr=(s,from)=>{const i=s.indexOf('[',from);let d=0,k=i;for(;k<s.length;k++){if(s[k]==='[')d++;else if(s[k]===']'&&--d===0)break;}return JSON.parse(s.slice(i,k+1));};
const RS=fs.readFileSync(SRC,'utf8');const R=arr(RS,RS.indexOf('export const REFERENCES'));const ET=arr(RS,RS.indexOf('export const ETUDES'));const GR=arr(RS,RS.indexOf('export const REF_GROUPS'));
const DOCS=new Set(R.filter(r=>!r.notPhysician).map(r=>r.handle)).size;
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 for(const theme of ['clair','sombre']){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];const tag=dn+'/'+theme;
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',tag,k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const axe=async()=>{if(!await p.evaluate(()=>!!window.axe))await p.addScriptTag({content:AXE});const v=await p.evaluate(async()=>(await axe.run(document.querySelector('[data-clr=accueil-references]'),{resultTypes:['violations']})).violations.map(v=>v.id+' '+v.nodes.slice(0,3).map(x=>x.target.join(' ')).join(' | ')));return v.length===0||v;};
 const blk=p.locator('[data-clr=accueil-references]');
 const bshot=async f=>{await p.addStyleTag({content:'header,nav.fixed,[data-clr=install]{visibility:hidden!important}'});await p.waitForTimeout(150);const h=await p.evaluate(()=>{const r=document.querySelector('[data-clr=accueil-references]').getBoundingClientRect();return [r.top+window.scrollY,r.height];});await p.screenshot({path:S+f,fullPage:true,clip:{x:0,y:Math.max(0,h[0]-16),width:opt.viewport?opt.viewport.width:390,height:h[1]+32}});await p.evaluate(()=>document.querySelectorAll('style').forEach(s=>s.textContent.includes('nav.fixed')&&s.remove()));};
 const check=async(mode)=>{
  ok(mode+' block visible',await blk.count()===1&&await blk.isVisible());
  const order=await p.evaluate(()=>{const m=document.querySelector('[data-clr=choix-mode]');const r=document.querySelector('[data-clr=accueil-references]');return !!(m&&r&&(m.compareDocumentPosition(r)&Node.DOCUMENT_POSITION_FOLLOWING));});
  ok(mode+' block right after mode choice',order);
  const st=await blk.locator('[data-stat]').evaluateAll(ls=>Object.fromEntries(ls.map(l=>[l.dataset.stat,l.querySelector('.clr-refs-stat-n').textContent])));
  ok(mode+' stats = data (X '+R.length+', médecins '+DOCS+', études '+ET.length+')',st.x===String(R.length)&&st.medecins===String(DOCS)&&st.etudes===String(ET.length)||st);
  const t=await blk.innerText();
  ok(mode+' wording',t.includes('Les références derrière l’appli')&&t.includes('publications de médecins sur X')&&t.includes('études scientifiques')||t.slice(0,200));
  ok(mode+' no Cochrane / contradiction',!/cochrane|contredi|pas d.effet/i.test(t));
  const hl=await blk.locator('[data-highlight]').evaluateAll(ls=>ls.map(l=>[+l.dataset.highlight,l.querySelector('a').getAttribute('href'),l.querySelector('a').target,l.querySelector('a').rel,l.querySelector('blockquote').textContent]));
  ok(mode+' 3 highlights',hl.length===3);
  ok(mode+' highlights = direct-level posts, exact url + gist',hl.every(([k,h,tg,rel,q])=>{const r=R.find(x=>x.n===k);return r&&r.level==='direct'&&!r.notPhysician&&r.url===h&&tg==='_blank'&&rel.includes('noopener')&&q.includes(r.gist);})||hl);
  ok(mode+' highlight group buttons match data',(await blk.locator('[data-home-ref]').evaluateAll(ls=>ls.map(l=>l.dataset.homeRef))).every((g,i)=>GR.find(x=>x.id===g)?.items.includes(hl[i][0])));
  const small=await blk.locator('a,button').evaluateAll(ls=>ls.filter(l=>l.getBoundingClientRect().height<44).map(l=>l.textContent));
  ok(mode+' tap targets >= 44px',small.length===0||small);
  ok(mode+' no horizontal overflow',await p.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
  ok(mode+' axe block',await axe());
 };
 await p.goto(url,{waitUntil:'networkidle'});await hide();
 if(theme==='sombre')await clk('Passer en mode sombre');
 await clk('Commencer');await hide();
 await check('sans-mode');
 await blk.locator('[data-clr=accueil-references-btn]').click();await p.waitForTimeout(500);
 ok('main button opens Références',(await p.locator('main h1').first().innerText())==='Références'&&await p.locator('[data-ref]').count()===R.length);
 await clk('Accueil');await hide();
 await clk('Mode Soutien');await hide();
 if(await blk.count()===0){await clk('Accueil');await hide();}
 await check('soutien');
 if(dn==='iphone13')await bshot('accueil-refs-soutien'+(theme==='sombre'?'-dark':'')+'.png');
 await clk('Mode Combat');await hide();await clk('Accueil');await hide();
 await check('combat');
 const col=await blk.evaluate(e=>getComputedStyle(e).borderTopColor);
 ok('combat uses Combat red',theme==='clair'?col==='rgb(168, 38, 27)':col==='rgb(255, 156, 130)'||col);
 if(dn==='iphone13')await bshot('accueil-refs'+(theme==='sombre'?'-dark':'')+'.png');
 await blk.locator('[data-home-ref=chaleur]').click();await p.waitForTimeout(700);
 ok('group button opens Références at Chaleur',(await p.locator('main h1').first().innerText())==='Références'&&await p.evaluate(()=>{const r=document.getElementById('ref-chaleur')?.getBoundingClientRect();return !!r&&r.top<window.innerHeight&&r.bottom>0;}));
 ok('no console errors',errs.length===0||errs);
 await ctx.close();}}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})();
