// NAC, échinacée et gingembre (branche nac-echinacee-gingembre) : fiche NAC adulte seulement (cachée en profil Enfant),
// échinacée renforcée (la ligne tisane reste), nouvelle fiche gingembre (dès 6 ans), encadrés Sécurité, renfort NAC optionnel
// en Combat + Kit (15 éléments), miel seul inchangé (sans gingembre), Références : groupe « NAC », ajouts Échinacée et Gingembre.
// usage : node tests/clr-nac-echinacee-gingembre.cjs http://localhost:4173/combat-le-rhume/
const {chromium,devices}=require('playwright');const fs=require('fs');const path=require('path');
const url=process.argv[2];let fail=0,n=0;const S=process.env.SHOTS||'/workspace/apps/combat-le-rhume-shots/';const PFX=process.env.PFX||'';
const NB=x=>x.replace(/[\u00a0\u202f]/g,' ').replace(/\u2011/g,'-').replace(/\s+/g,' ');
const N7=JSON.parse(fs.readFileSync('/workspace/apps/combat-le-rhume-nac-echinacee-gingembre-final.json','utf8'));
const NAC_HOW='600 mg de NAC, 1 à 2 fois par jour avec un repas, pendant la saison des rhumes et grippes. Adulte seulement.';
const NAC_CA='Au Canada, pour plus de 600 mg par jour (adulte de 18 ans et plus) : passe par un pharmacien ou un médecin.';
const NAC_DF='Essai De Flora 1997 (262 personnes âgées, 6 mois d’hiver) : 600 mg 2 fois par jour.';
const NAC_SEC=['Asthme : la NAC peut déclencher un bronchospasme. Arrête tout de suite si la respiration siffle ou se resserre.','Ulcère de l’estomac ou du duodénum (actuel ou passé) : demande avis avant.','Nitroglycérine : la NAC en augmente l’effet (maux de tête, étourdissements). Antibiotiques : demande au pharmacien comment espacer les prises.','Grossesse et allaitement : demande à un professionnel de la santé avant.','Calculs rénaux : demande avis avant.','Troubles de la coagulation ou chirurgie prévue : la NAC pourrait ralentir la coagulation. Arrête-la 2 semaines avant une chirurgie.','Jamais avant 2 ans. Enfant : seulement sur avis médical.','Effets fréquents : odeur de soufre, nausées, vomissements, diarrhée. Au début, le mucus peut être plus abondant : prudence si tu tousses faiblement.'];
const ECH_TISANE='Tisane, 1 à 2 tasses par jour, ou extrait selon l’étiquette, avec des prises augmentées pendant le rhume ou la grippe. Commencer dès les premiers symptômes.';
const ECH_EXTRA=['Jusqu’à 10 jours.','Extrait standardisé d’Echinacea purpurea (plante fraîche), dès les premiers symptômes et jusqu’à 10 jours : environ 4 000 mg d’extrait par jour en plusieurs prises (type Echinaforce), ou Echinilin : 10 doses le 1er jour, puis 4 doses par jour pendant 7 jours. Suivre l’étiquette du produit.','En prévention pendant la saison : 2 400 mg par jour, en cycles de 2 mois séparés par 1 semaine de pause.'];
const ECH_SEC=['Allergie aux Astéracées (herbe à poux, marguerite, camomille, chrysanthème) : ne pas en prendre. Asthme, eczéma ou rhume des foins : risque de réaction allergique, demande avis avant.','Maladie auto-immune (comme la sclérose en plaques), tuberculose, VIH ou autre baisse de l’immunité, ou médicaments immunosuppresseurs : pas sans avis médical.','Enfants : la partie aérienne dès 2 ans, la racine pas avant 12 ans (Santé Canada). De 4 à 12 ans, en prévention : Echinaforce Junior sur avis médical.','Grossesse : en parler à un professionnel de la santé avant. Peu de données pour l’allaitement.','Durée : jusqu’à 10 jours en traitement ; en prévention, cycles de 2 mois avec pause. Consulte si les symptômes durent plus de 10 jours, s’aggravent ou si une forte fièvre apparaît.','Effets possibles : maux de ventre, nausées, éruption de la peau. Arrête en cas de réaction allergique.'];
const GIN_HOW='Tisane : 5 à 10 g de racine fraîche râpée (2 à 4 cm), infusée 10 minutes dans 250 ml d’eau chaude, 2 à 3 tasses par jour. Ou 1,5 g de gingembre en poudre ou en capsule, 2 fois par jour.';
const GIN_MAX='Maximum 3 g de racine séchée par jour. À partir de 6 ans.';
const GIN_SEC=['Anticoagulants (comme la warfarine) ou antiplaquettaires (comme l’aspirine ou le clopidogrel) : risque de saignement, demande au pharmacien avant d’en prendre en supplément.','Calculs biliaires : seulement après avis médical.','Grossesse : en parler à un professionnel de la santé avant de prendre des suppléments. Peu de données pour l’allaitement.','Médicaments du diabète ou de la tension : le gingembre peut renforcer leur effet. Surveille et demande au pharmacien.','Effets possibles : brûlures d’estomac, inconfort au ventre, diarrhée, irritation de la bouche ou de la gorge.'];
const KITN='Optionnel (adulte) : NAC 600 mg, avec numéro NPN, à prendre avec un repas';
const MIEL='Pour le mal de gorge, prendre seulement du miel : 1 cuillère à soupe de miel seul, avec une cuillère qui n’est pas en métal (bois, plastique ou céramique). Pas dans une tisane, pas de citron.';
const LBL={'@MedCramVideos':'Chaîne médicale (Roger Seheult, MD)','@BostonTox':'MD non vérifié','@DrDavidBilstrom':'MD non vérifié','@AleksandragMD':'MD non vérifié','@DocFoster':'MD non vérifié','@drwillcole':'Chiropraticien, pas médecin','@drjoshaxe':'Chiropraticien, pas médecin','@DoctaMoe':'Naturopathe (ND), pas médecin','@DrDianaND':'Naturopathe (ND), pas médecin'};
const BAD=/hydroxychloroquin|ivermectin|vaccin|cigarette|mitig|Cochrane|contredi/i;
const GT={nac:'NAC (N-acétylcystéine)',echinacee:'Échinacée',gingembre:'Gingembre, ail et liquides'};
// références internationales ajoutées ensuite (clr-international) : comptées dans les totaux affichés, exclues des vérifications du groupe
const INTL={nac:6,echinacee:5,gingembre:9};const NEW={nac:[12,12],echinacee:[8,13],gingembre:[4,6]};const TOT={nac:[12,12],echinacee:[9,20],gingembre:[9,12]};
(async()=>{const b=await chromium.launch({executablePath:'/home/box/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome'});
 {const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL','src',k,v===true?'':JSON.stringify(v).slice(0,300));if(v!==true)fail++;};
  const rd=f=>fs.readFileSync(path.join(process.env.APPDIR||path.join(__dirname,'..'),f),'utf8');const c=rd('src/data/contenu.js');
  ok('sources : miel seul inchangé',c.includes(MIEL));
  ok('sources : enfant NAC « Jamais avant 2 ans »',c.includes('nac: `Jamais avant 2 ans. Enfant : seulement sur avis médical. La dose de 600 mg est pour l’adulte.`'));
  ok('sources : enfant gingembre dès 6 ans',c.includes('gingembre: `À partir de 6 ans, dose réduite selon l’âge (Santé Canada).'));
  ok('sources : recette tisane gingembre à la nouvelle dose',c.includes('`5 à 10 g de gingembre frais râpé (2 à 4 cm)`')&&c.includes('`Infuser le gingembre 10 minutes.`')&&c.includes('use: `2 à 3 tasses par jour.'));
  ok('sources : JSON final = 24 publications + 31 études',N7.posts.length===24&&N7.etudes.length===31&&N7.posts.every(p=>['direct','partiel'].includes(p.level))&&N7.etudes.every(e=>['direct','partiel'].includes(e.level)));
  const dist=path.join(process.env.APPDIR||path.join(__dirname,'..'),'..','assets');const js=fs.readdirSync(dist).filter(f=>f.endsWith('.js')).map(f=>fs.readFileSync(path.join(dist,f),'utf8')).join('\n').replace(/\\xA0/g,' ');
  ok('site publié : fiches NAC, échinacée, gingembre',[NAC_HOW,GIN_HOW,ECH_EXTRA[1],...NAC_SEC].every(x=>NB(js).includes(x)));}
for(const [dn,opt] of [['desktop',{viewport:{width:1280,height:720}}],['iphone13',devices['iPhone 13']]]){
 const ctx=await b.newContext({...opt,locale:'fr-CA',timezoneId:'America/Toronto'});const p=await ctx.newPage();const errs=[];
 p.on('console',m=>m.type()==='error'&&errs.push(m.text()));p.on('pageerror',e=>errs.push('pageerror '+e.message));
 const ok=(k,v)=>{n++;console.log(v===true?'ok  ':'FAIL',dn,k,v===true?'':JSON.stringify(v).slice(0,400));if(v!==true)fail++;};
 const clk=async(nm)=>{const l=p.getByRole('button',{name:nm,exact:true});for(let i=0;i<await l.count();i++)if(await l.nth(i).isVisible()){await l.nth(i).click();await p.waitForTimeout(350);return;}throw new Error('no '+nm);};
 const hide=async()=>{const h=p.getByRole('button',{name:'Masquer la bannière d’installation'});if(await h.count()&&await h.first().isVisible()){await h.first().click();await p.waitForTimeout(200);}};
 const openAll=async()=>{for(let k=0;k<80;k++){const l=p.locator('main button[aria-expanded=false]:visible');if(!await l.count())break;await l.first().click();await p.waitForTimeout(80);}};
 const shotAt=async(loc,file)=>{await loc.evaluate(e=>{document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,e.getBoundingClientRect().top+window.scrollY-document.querySelector('header').offsetHeight-8);});await p.waitForTimeout(250);await p.screenshot({path:S+PFX+file});};
 const shotCard=async(loc,file)=>{const st=await p.addStyleTag({content:'nav.fixed,[data-clr=install]{visibility:hidden!important}header{position:relative!important;top:auto!important}'});await loc.scrollIntoViewIfNeeded();await p.waitForTimeout(200);await loc.screenshot({path:S+PFX+file});await st.evaluate(e=>e.remove());await p.evaluate(()=>window.scrollTo(0,0));};
 const search=async q=>{await p.getByPlaceholder('Rechercher un remède ou un symptôme…').fill(q);await p.waitForTimeout(300);};
 await p.goto(url,{waitUntil:'networkidle'});await hide();await clk('Commencer');await hide();
 // Accueil : nouveaux totaux
 const home=NB(await p.locator('main').innerText());
 ok('accueil : 166 publications et 234 études (avec les références internationales)',home.includes('166 publications et 234 études')||home.slice(0,600));
 await clk('Remèdes');await hide();await openAll();
 // NAC
 const nac=p.locator('#remede-nac');ok('fiche NAC présente',await nac.count()===1);
 const nt=NB(await nac.innerText());
 ok('NAC : titre (trait d’union insécable)',(await nac.locator('h2,h3').first().innerText()).includes('NAC (N\u2011acétylcystéine)'));
 ok('NAC : 600 mg 1 à 2 fois par jour avec un repas, adulte',nt.includes(NAC_HOW)||nt);
 ok('NAC : De Flora 600 mg 2 fois par jour + Canada > 600 mg pharmacien/médecin',nt.includes(NAC_DF)&&nt.includes(NAC_CA)||nt);
 ok('NAC : kicker + étiquette',nt.toUpperCase().includes('SAISON DES RHUMES ET GRIPPES · ADULTE')&&nt.includes('Grippe · mucus · adulte')||nt);
 const ns=(await nac.locator('[data-clr=nac-securite] li').allInnerTexts()).map(NB);
 ok('NAC : Sécurité (8 lignes exactes : asthme, ulcère, nitroglycérine/antibiotiques, grossesse, reins, coagulation, 2 ans, effets)',JSON.stringify(ns)===JSON.stringify(NAC_SEC)||ns);
 ok('NAC : Sécurité étiquetée',(await nac.locator('[data-clr=nac-securite]').getAttribute('aria-label'))==='Sécurité : NAC');
 ok('NAC : lien Références NAC (30)',(await nac.locator('[data-ref-link=nac]').innerText()).includes('NAC (N-acétylcystéine) (30)'));
 // Échinacée
 const ech=p.locator('#remede-echinacee');const et=NB(await ech.innerText());
 ok('échinacée : ligne tisane conservée',et.includes(ECH_TISANE)||et);
 ok('échinacée : extrait standardisé 4 000 mg / Echinilin, 10 jours, prévention 2 400 mg en cycles de 2 mois',ECH_EXTRA.every(x=>et.includes(x))||et);
 const es=(await ech.locator('[data-clr=echinacee-securite] li').allInnerTexts()).map(NB);
 ok('échinacée : Sécurité (Astéracées, auto-immun, enfants, grossesse, durée, effets)',JSON.stringify(es)===JSON.stringify(ECH_SEC)||es);
 ok('échinacée : lien Références Échinacée (34)',(await ech.locator('[data-ref-link=echinacee]').innerText()).includes('Échinacée (34)'));
 // Gingembre
 const gin=p.locator('#remede-gingembre');ok('fiche gingembre présente',await gin.count()===1);
 const gt=NB(await gin.innerText());
 ok('gingembre : tisane 5 à 10 g 10 min 250 ml 2 à 3 tasses, ou 1,5 g 2 fois',gt.includes(GIN_HOW)||gt);
 ok('gingembre : max 3 g de racine séchée, dès 6 ans',gt.includes(GIN_MAX)||gt);
 const gs=(await gin.locator('[data-clr=gingembre-securite] li').allInnerTexts()).map(NB);
 ok('gingembre : Sécurité (anticoagulants, calculs biliaires, grossesse, diabète/tension, effets)',JSON.stringify(gs)===JSON.stringify(GIN_SEC)||gs);
 ok('gingembre : lien Références Gingembre (30)',(await gin.locator('[data-ref-link=gingembre]').innerText()).includes('Gingembre, ail et liquides (30)'));
 const mt=NB(await p.locator('#remede-miel').innerText());ok('fiche miel seul inchangée, sans gingembre',mt.includes(MIEL)&&!/gingembre/i.test(mt)||mt);
 if(dn==='iphone13'){await shotCard(nac,'nac-fiche.png');await shotCard(ech,'echinacee-fiche.png');await shotCard(gin,'gingembre-fiche.png');}
 const has=async id=>await p.locator('#remede-'+id).count()===1;
 for(const [f,want] of [['Fièvre',{nac:1,echinacee:1,gingembre:0}],['Toux',{nac:1,echinacee:0,gingembre:1}],['Gorge',{nac:0,echinacee:0,gingembre:1}],['Prudence',{nac:1,gingembre:0}]]){await clk(f);for(const [id,w] of Object.entries(want))ok('filtre '+f+' : '+id+(w?' présent':' absent'),await has(id)===!!w);}
 await clk('Tous');
 for(const [q,id] of [['NAC','nac'],['acétylcystéine','nac'],['Echinaforce','echinacee'],['gingembre','gingembre']]){await search(q);ok('recherche : '+q,await has(id));}
 await search('');
 // Combat
 await clk('Accueil');await clk('Mode Combat');await hide();
 const nc=p.locator('[data-clr=nac-combat]');ok('combat : renfort NAC visible',await nc.isVisible());
 const ct=NB(await nc.innerText());
 ok('combat : renfort optionnel grippe, dose, Canada, Sécurité',ct.toUpperCase().includes('RENFORT OPTIONNEL · GRIPPE')&&ct.includes(NAC_HOW)&&ct.includes(NAC_CA)&&ct.includes('Optionnel : ne remplace pas les cinq gestes. Adulte seulement.')&&NAC_SEC.every(x=>ct.includes(x))||ct);
 ok('combat : renfort NAC juste après le clou de girofle',await p.locator('[data-clr=panel] > *').evaluateAll(cs=>{const i=cs.findIndex(c=>c.dataset.clr==='girofle-combat');return i>=0&&cs[i+1]?.dataset.clr==='nac-combat';}));
 ok('combat : cinq gestes (NAC en renfort, pas un 6e geste)',await p.locator('main h2').filter({hasText:/Spray Betadine|Peroxyde d’hydrogène 3 %|Pastilles antiseptiques|Miel seul|Double dose de vitamine C/}).count()===5);
 ok('combat : miel seul sans gingembre ni NAC',!/gingembre|NAC|échinacée/i.test(await p.locator('main').evaluate(m=>[...m.querySelectorAll('h2')].filter(h=>/Miel seul/.test(h.textContent)).map(h=>h.closest('section,article,div').innerText).join(' '))));
 const kt=NB(await p.locator('[data-clr=kit]').innerText());ok('kit : NAC optionnelle (15 éléments)',kt.includes(KITN)&&kt.includes('0 / 15')||kt);
 if(dn==='iphone13'){await shotCard(nc,'nac-combat.png');}
 await nc.locator('[data-ref-link=nac]').click();await p.waitForTimeout(600);
 const top=await p.locator('#ref-nac').evaluate(e=>e.getBoundingClientRect().top);ok('combat : renfort → Références NAC',(await p.locator('main h1').first().innerText())==='Références'&&top>=0&&top<400||top);
 // Références
 for(const g of ['nac','echinacee','gingembre']){
  const [np,ne]=NEW[g];const [tp,te]=TOT[g];
  ok('références : groupe '+GT[g]+' ('+tp+' X + '+te+' études)',(await p.locator('#ref-'+g+'-t').innerText())===GT[g]&&await p.locator('#ref-'+g+' [data-ref]:not([data-intl])').count()===tp&&await p.locator('#ref-'+g+' [data-etude]:not([data-intl])').count()===te||[await p.locator('#ref-'+g+' [data-ref]:not([data-intl])').count(),await p.locator('#ref-'+g+' [data-etude]:not([data-intl])').count()]);
  const P=N7.posts.filter(x=>x.group===g),E=N7.etudes.filter(x=>x.group===g);
  ok('références '+g+' : '+np+' nouvelles publications, '+ne+' nouvelles études',P.length===np&&E.length===ne);
  const rs=await p.locator('#ref-'+g+' [data-ref]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.ref,h:l.querySelector('a[href*="x.com"]').getAttribute('href'),lb:l.querySelector('[data-clr=pas-medecin]')?.textContent??null,b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
  ok('références '+g+' : publications X, citations, étiquettes honnêtes, niveau',P.every(x=>{const r=rs.find(y=>y.n===x.n);return r&&r.h===x.url&&r.lb===(LBL[x.handle]??null)&&r.b===x.level&&NB(r.t).includes(NB(x.quote))&&NB(r.t).includes(NB(x.gist));})||rs.filter(r=>r.n>121).map(r=>[r.n,r.lb,r.b]));
  const ee=await p.locator('#ref-'+g+' [data-etude]').evaluateAll(ls=>ls.map(l=>({n:+l.dataset.etude,doi:l.querySelector('[data-doi]')?.getAttribute('href'),pm:l.querySelector('[data-pubmed]').getAttribute('href'),b:l.querySelector('[data-badge]').dataset.badge,t:l.innerText})));
  ok('références '+g+' : études DOI + PubMed + résumé + niveau',E.every(x=>{const e=ee.find(y=>y.n===x.n);return e&&e.doi===x.doiUrl&&e.pm===x.pubmed&&e.b===x.level&&NB(e.t).includes(NB(x.finding))&&e.t.includes(x.title);})||ee.filter(e=>e.n>135).map(e=>e.n));
  const sx=(await p.locator('[data-securite='+g+'] li').allInnerTexts()).map(NB);ok('références '+g+' : Sécurité',JSON.stringify(sx)===JSON.stringify(N7.nuances[g].map(NB))||sx);
  const nt2=await p.locator('#ref-'+g+' [data-ref],#ref-'+g+' [data-etude]').evaluateAll(ls=>ls.filter(l=>(+(l.dataset.ref||0)>121||+(l.dataset.etude||0)>135)&&!l.hasAttribute('data-intl')).map(l=>l.innerText).join(' '));
  ok('références '+g+' : nouveaux ajouts sans rien de nuancé ni contradictoire',!BAD.test(NB(nt2))&&!BAD.test(N7.nuances[g].join(' '))||NB(nt2).match(BAD));
  ok('références : sommaire '+GT[g]+' ('+(tp+te+INTL[g])+', avec '+INTL[g]+' internationales)',(await p.locator('[data-otp]').textContent()).includes(GT[g]+' ('+(tp+te+INTL[g])+')'));
 }
 ok('références : De Flora 1997 appuie directement',(await p.locator('#ref-nac [data-etude]:not([data-intl])').filter({hasText:'De Flora'}).locator('[data-badge]').getAttribute('data-badge'))==='direct');
 ok('références : 166 publications et 234 études',NB(await p.locator('main').innerText()).includes('166 publications et 234 études'));
 if(dn==='iphone13'){await shotAt(p.locator('#ref-nac'),'nac-refs.png');}
 // Profil Enfant
 await clk('Accueil');await clk('Mode Combat');await hide();await clk('Enfant');await p.waitForTimeout(300);
 ok('enfant : renfort NAC caché',await p.locator('[data-clr=nac-combat]').count()===0);
 const ke=await p.locator('[data-clr=kit]').innerText();ok('enfant : kit sans NAC (11 éléments)',!/NAC/.test(ke)&&ke.includes('0 / 11')||ke);
 await clk('Accueil');await clk('Mode Soutien');await hide();await clk('Remèdes');await hide();await clk('Tous');await openAll();
 ok('enfant : fiche NAC cachée',await p.locator('#remede-nac').count()===0);
 await search('NAC');ok('enfant : recherche NAC vide',await p.locator('#remede-nac').count()===0);await search('');await openAll();
 const ge=NB(await p.locator('#remede-gingembre').innerText());ok('enfant : gingembre dès 6 ans + Sécurité visible',ge.includes('À partir de 6 ans, dose réduite selon l’âge (Santé Canada).')&&await p.locator('#remede-gingembre [data-clr=gingembre-securite]').count()===1||ge);
 const ee2=NB(await p.locator('#remede-echinacee').innerText());ok('enfant : échinacée 2 ans / racine 12 ans + Sécurité visible',ee2.includes('Partie aérienne dès 2 ans, la racine pas avant 12 ans')&&await p.locator('#remede-echinacee [data-clr=echinacee-securite]').count()===1||ee2);
 await clk('Adulte');await p.waitForTimeout(200);
 ok('0 console errors',errs.length===0||errs);
 await ctx.close();}
await b.close();console.log('checks',n,'failures',fail);process.exit(fail?1:0);})().catch(e=>{console.error(e);process.exit(1)});
