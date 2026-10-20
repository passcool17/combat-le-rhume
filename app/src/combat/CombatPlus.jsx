// Combat le rhume — Mode Combat : protocole de 3 jours, gestes, suivi, consulter, Kit Combat.
import * as React from 'react';
import { usePrefs } from '../lib/stockage.js';
import { useSuivi } from '../lib/suivi.js';
import { useNav } from '../lib/nav.js';
import './combat.css';
import { RefCard } from '../pages/RefCard.jsx';

const prefsAudience = () => usePrefs.getState().audience;
const setStanceGlobal = v => usePrefs.getState().setStance(v);
const DAY = 864e5;
const PROTOCOL_DAYS = 3;
const PHASE_NAMES = ['Frappe immédiate', 'Pression constante', 'On tient la ligne'];

export const GESTES = [
  { id: 'betadine', short: 'Spray povidone-iode 0,45 %', act: '1 vaporisation au fond de la gorge', every: 8,
    hint: 'L’appli indique jusqu’à 3 fois par jour. Suivre l’étiquette.' },
  { id: 'peroxyde', short: 'Gargarisme au peroxyde 3 %', act: 'Gargariser, recracher', every: 8,
    hint: 'Usage court. Suivre l’étiquette.' },
  { id: 'pastilles', short: 'Pastilles antiseptiques', act: '1 pastille', every: 3,
    hint: 'Suivre le nombre indiqué sur le produit.' },
  { id: 'miel', short: 'Miel cru', act: '1 c. à soupe de miel seul, cuillère pas en métal · ne pas boire juste après', every: 3,
    hint: 'Miel seul, sans tisane ni citron. Plusieurs fois par jour.' },
  { id: 'vitamine-c-double', short: 'Double dose de vitamine C', act: '1 prise avec de l’eau, 2 fois par jour', every: 12,
    hint: 'Doubler sa dose habituelle (par ex. 500 mg → 1000 mg par jour), en 2 prises. Max 2000 mg par jour chez l’adulte.' },
];

const PRECAUTIONS = {
  adulte: {
    betadine: ['À éviter en cas d’allergie à l’iode, de problème de thyroïde, de grossesse ou d’allaitement.', 'Recracher l’excédent. Arrêter si ça irrite.'],
    peroxyde: ['Peroxyde 3 % food grade seulement : recracher, ne jamais avaler.', 'Pas pour les jeunes enfants. Pas en même temps que le spray.'],
    pastilles: ['Suivre le nombre indiqué sur la boîte. Ne pas dépasser.'],
    miel: ['Jamais avant 1 an.'],
  },
  enfant: {
    betadine: ['Pas avant 6 ans. À partir de 6 ans, sous surveillance : 1 vaporisation, jusqu’à 3 fois par jour.', 'À éviter en cas d’allergie à l’iode ou de problème de thyroïde.'],
    peroxyde: ['Pas pour les jeunes enfants : retiré du profil Enfant.'],
    pastilles: ['Selon l’âge indiqué sur la boîte. Pas les pastilles fortes d’adulte.', 'Attention au risque d’étouffement chez les petits.'],
    miel: ['Jamais avant 1 an.'],
    'vitamine-c-double': ['Chez l’enfant, la dose dépend de l’âge : demander au pharmacien avant de doubler.', 'Prudence en cas de calculs rénaux ou d’hémochromatose. Si l’enfant prend des médicaments, demande au pharmacien.'],
  },
};

const KIT = [
  { id: 'spray', label: 'Spray povidone-iode 0,45 % (flacon de 50 ml)' },
  { id: 'peroxyde', label: 'Peroxyde d’hydrogène 3 % food grade, bouteille à l’abri de la lumière' },
  { id: 'verre', label: 'Petit verre et cuillère à soupe pour le gargarisme' },
  { id: 'pastilles-fortes', label: 'Pastilles antiseptiques fortes' },
  { id: 'pastilles-douces', label: 'Pastilles plus douces pour la suite' },
  { id: 'miel', label: 'Miel cru et cuillère en bois, plastique ou céramique (pas de métal)' },
  { id: 'vitamine-c', label: 'Vitamine C (comprimés)' },
  { id: 'citron', label: 'Citrons et tisanes' },
  { id: 'thermometre', label: 'Thermomètre' },
  { id: 'tuque', label: 'Tuque et bas pour la nuit' },
  { id: 'eau', label: 'De quoi boire 2,5 à 3 L par jour' },
];

const RED_FLAGS = [
  { id: 'fievre', label: 'Fièvre' },
  { id: 'frissons', label: 'Frissons' },
  { id: 'teteIntense', label: 'Mal de tête intense' },
  { id: 'avaler', label: 'Difficulté à avaler', urgent: true },
  { id: 'respirer', label: 'Difficulté à respirer', urgent: true },
  { id: 'sansAmelioration', label: 'Plus de 3 jours sans amélioration' },
];

// ---------- stockage : données unifiées du Suivi (lib/suivi.js) ----------
const get = () => useSuivi.getState().data;
function set(fn) {
  useSuivi.getState().update(fn);
  scheduleReminders();
}
const useStore = () => useSuivi(st => st.data);
function useNow(ms = 30000) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => { const t = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(t); }, [ms]);
  return now;
}

// ---------- calculs ----------
const pad = n => String(n).padStart(2, '0');
const dayKey = (t = Date.now()) => { const d = new Date(t); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const fmtTime = t => new Date(t).toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' });
const fmtDate = t => new Date(t).toLocaleDateString('fr-CA', { weekday: 'long', day: 'numeric', month: 'long' });
const intervalOf = (s, id) => s.intervals[id] ?? GESTES.find(g => g.id === id).every;
export function protocolDay(p, now = Date.now()) {
  if (!p) return 0;
  return Math.floor((new Date(dayKey(now)) - new Date(dayKey(p.start))) / DAY) + 1;
}
function activeChecks(s) {
  if (!s.protocol) return [];
  return s.checks.filter(c => c.t >= s.protocol.start).sort((a, b) => a.t - b.t);
}
export function assess(s, now = Date.now()) {
  const checks = activeChecks(s);
  const flags = new Set();
  for (const c of checks) {
    if (c.fievre) flags.add('fievre');
    if (c.frissons) flags.add('frissons');
    if (c.tete === 'intense') flags.add('teteIntense');
    if (c.tete && c.tete !== 'non') flags.add('tete');
    if (c.avaler) flags.add('avaler');
    if (c.respirer) flags.add('respirer');
  }
  if (s.protocol) {
    const from = dayKey(s.protocol.start);
    for (const e of s.journal || []) {
      if (e.date < from) continue;
      if (e.symptoms.includes('fievre')) flags.add('fievre');
      if (e.symptoms.includes('maux-tete')) flags.add('tete');
    }
  }
  if (s.protocol && now - s.protocol.start > PROTOCOL_DAYS * DAY && checks.length) {
    const first = checks[0].gorge, last = checks[checks.length - 1].gorge;
    if (last >= first) flags.add('sansAmelioration');
  }
  const urgent = flags.has('avaler') || flags.has('respirer');
  const consult = urgent || ['fievre', 'frissons', 'teteIntense', 'sansAmelioration'].some(f => flags.has(f));
  // fièvre, frissons ou mal de tête (même léger) : pas de surchauffe ni de tuque
  const noWarm = flags.has('fievre') || flags.has('frissons') || flags.has('tete');
  return { flags, urgent, consult, noWarm };
}

// ---------- rappels (Notifications du navigateur) ----------
let timers = [];
function scheduleReminders() {
  timers.forEach(clearTimeout); timers = [];
  const s = get();
  if (typeof window === 'undefined' || !s.reminders || !s.protocol || !('Notification' in window) || Notification.permission !== 'granted') return;
  const now = Date.now();
  for (const g of GESTES) {
    if (s.protocol.audience === 'enfant' && g.id === 'peroxyde') continue;
    const last = s.intakes.filter(i => i.g === g.id && i.t >= s.protocol.start).at(-1);
    if (!last) continue;
    const due = last.t + intervalOf(s, g.id) * 36e5;
    if (due > now && due - now < 2 ** 31 - 1) timers.push(setTimeout(() => notify(g), due - now));
  }
}
async function notify(g) {
  const title = 'Combat le rhume';
  const opts = { body: `${g.short} : possible maintenant. Suivre l’étiquette.`, icon: '/combat-le-rhume/icons/icon-192.png', tag: 'clr-' + g.id };
  try { const r = await navigator.serviceWorker?.getRegistration(); if (r) return r.showNotification(title, opts); } catch {}
  try { new Notification(title, opts); } catch {}
}

// ---------- petits composants ----------
const cx = (...a) => a.filter(Boolean).join(' ');
function Card({ children, caution, className, ...rest }) {
  return <section {...rest} className={cx('rounded-[var(--radius-card)] border bg-surface p-5', caution ? 'border-caution/40' : 'border-line', className)}>{children}</section>;
}
function Kicker({ children }) { return <p className="text-xs font-medium tracking-widest text-muted uppercase">{children}</p>; }
function Btn({ children, variant = 'primary', className, ...rest }) {
  const v = variant === 'primary' ? 'bg-primary text-primary-fg' : variant === 'caution' ? 'clr-btn-caution' : 'border border-line bg-surface text-ink';
  return <button type="button" {...rest} className={cx('clr-btn', v, className)}>{children}</button>;
}

const WARM_HOME = 'Combattre dès les premiers signes. La nuit, avoir très chaud, même avec une tuque — seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons.';
const WARM_COMBAT = 'Les cinq gestes, dans l’ordre. La nuit, très chaud, même une tuque — seulement s’il n’y a pas de fièvre, de mal de tête ou de frissons.';

function Subtitle() {
  const s = useStore();
  return assess(s).noWarm
    ? 'Les cinq gestes, dans l’ordre. Fièvre, frissons ou mal de tête notés : pas de surchauffe ni de tuque la nuit. Voir « Quand arrêter et consulter ».'
    : WARM_COMBAT;
}
function HomeWarm() {
  const s = useStore();
  return assess(s).noWarm
    ? 'Combattre dès les premiers signes. Fièvre, frissons ou mal de tête notés : pas de surchauffe ni de tuque la nuit. Voir « Quand arrêter et consulter ».'
    : WARM_HOME;
}

// ---------- nuit au chaud : nuit 1 la plus importante, nuits 2 et 3 si toujours pas de fièvre ----------
function NightWarm({ day, audience, compact }) {
  const s = useStore();
  const a = assess(s);
  if (!day || day > PROTOCOL_DAYS) return null;
  const enfant = audience === 'enfant';
  const first = day === 1;
  const fever = a.flags.has('fievre');
  if (a.noWarm) {
    return (
      <div className="clr-night off mt-4" data-clr="nuit-chaude" data-nuit={day} data-etat="pas-de-surchauffe" role="status">
        <p className="clr-night-k">Nuit {day} sur {PROTOCOL_DAYS}</p>
        <p className="clr-night-t">{fever ? 'Fièvre notée' : 'Frissons ou mal de tête notés'} : pas de surchauffe ni de tuque cette nuit.</p>
        {compact ? null : <p className="mt-1 text-sm">Couvre-toi normalement, bois de l’eau. Voir « Quand arrêter et consulter ».</p>}
      </div>
    );
  }
  const title = enfant
    ? (first ? 'Nuit 1 : la plus importante — garder le corps bien au chaud, sans surchauffer' : `Nuit ${day} : garder le corps bien au chaud`)
    : (first ? 'Nuit 1 : la plus importante — faire monter la chaleur du corps' : `Nuit ${day} : encore faire monter la chaleur du corps`);
  return (
    <div className={cx('clr-night mt-4', first && 'first')} data-clr="nuit-chaude" data-nuit={day} data-etat="chaud">
      <p className="clr-night-k">{first ? <><span aria-hidden="true">🔥 </span>L’assaut de chaleur</> : `Nuit ${day} sur ${PROTOCOL_DAYS} · chaleur maintenue`}</p>
      <p className="clr-night-t">{title}</p>
      <p className="clr-night-why mt-1 text-sm">Une température du corps plus élevée aide le système immunitaire à éliminer l’infection.</p>
      {first ? null : <p className="mt-1 text-sm font-medium">Si tu ne fais toujours pas de température (fièvre de 38 °C ou plus). Aucune fièvre notée depuis le début du protocole.</p>}
      {compact ? null : <>
        <ul className="clr-night-l mt-2">
          {(enfant
            ? ['Bien couvrir l’enfant : couvertures, sans surchauffer', 'Bas']
            : ['Bien se couvrir : couvertures, tuque', 'Bas']
          ).map(t => <li key={t} className="text-sm">{t}</li>)}
        </ul>
        <p className="clr-night-s mt-2 text-xs">{enfant
          ? 'Ne pas surchauffer un enfant, jamais un bébé. Faire boire de l’eau. Le découvrir s’il a de la fièvre, s’il est étourdi ou s’il ne va pas bien.'
          : 'Bois bien de l’eau. Découvre-toi si fièvre de 39 °C ou plus, étourdissements ou malaise. Pas pour les bébés ni les jeunes enfants.'}</p>
        <button type="button" className="clr-ref-cta" data-ref-link="chaleur" onClick={() => useNav.getState().openReferences('chaleur')}>Références : Chaleur du corps</button>
      </>}
    </div>
  );
}

// ---------- protocole + checklist ----------
function Protocol({ audience }) {
  const s = useStore();
  const now = useNow();
  const p = s.protocol;
  const [confirmCancel, setConfirmCancel] = React.useState(false);
  if (!p) {
    const last = s.history.at(-1);
    return (
      <Card className="clr-start" data-clr="protocole">
        <Kicker><span aria-hidden="true">🎯 </span>Plan d’attaque · 3 jours</Kicker>
        <h2 className="mt-1 text-xl">Dès le premier mal de gorge, on attaque</h2>
        <p className="mt-2 text-sm text-muted">Tes cinq armes du jour, cochées au fur et à mesure, et un point matin et soir sur les symptômes. Tout reste dans cet appareil.</p>
        <p className="clr-night-hint mt-2 text-sm" data-clr="nuit-1-annonce">Nuit 1 : la plus importante — faire monter la chaleur du corps, s’il n’y a pas de fièvre.</p>
        <Btn className="clr-btn-big clr-pulse mt-4" onClick={() => set(() => ({ protocol: { start: Date.now(), audience } }))}>J’ai mal à la gorge, je commence</Btn>
        {last ? <p className="mt-3 text-xs text-muted">Dernier protocole : commencé le {fmtDate(last.start)}, {last.status === 'termine' ? 'terminé' : 'annulé'} le {fmtDate(last.end)}.</p> : null}
      </Card>
    );
  }
  const day = protocolDay(p, now);
  const over = day > PROTOCOL_DAYS;
  const end = status => set(s0 => ({ protocol: null, reminders: s0.reminders, history: [...s0.history, { start: p.start, end: Date.now(), status }].slice(-10),
    ...(status === 'annule' ? { intakes: s0.intakes.filter(i => i.t < p.start), checks: s0.checks.filter(c => c.t < p.start) } : {}) }));
  return (
    <Card data-clr="protocole">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Kicker><span aria-hidden="true">🎯 </span>Plan d’attaque en cours</Kicker>
          <h2 className="mt-1 text-xl">{over ? 'Les 3 jours sont passés' : `Jour ${day} sur ${PROTOCOL_DAYS}`}</h2>
          {over ? null : <p className="clr-phase" data-clr="phase">Jour {day} : {PHASE_NAMES[day - 1]}</p>}
          <p className="mt-1 text-sm text-muted">Commencé le {fmtDate(p.start)} à {fmtTime(p.start)}.</p>
        </div>
        <span className="clr-days" aria-hidden="true">{[1, 2, 3].map(d => <i key={d} className={cx(d < day && 'done', d === day && 'today')} />)}</span>
      </div>
      {over ? <p className="mt-3 text-sm text-ink">Fais le point avec le suivi ci-dessous. Si ça ne va pas mieux, consulte.</p> : null}
      <NightWarm day={day} audience={p.audience || audience} />
      <Checklist audience={audience} now={now} />
      <div className="mt-4 flex flex-wrap gap-2">
        <Btn onClick={() => end('termine')}>Terminer</Btn>
        {confirmCancel
          ? <><Btn variant="caution" onClick={() => end('annule')}>Oui, annuler et effacer</Btn><Btn variant="ghost" onClick={() => setConfirmCancel(false)}>Non</Btn></>
          : <Btn variant="ghost" onClick={() => setConfirmCancel(true)}>Annuler le protocole</Btn>}
      </div>
    </Card>
  );
}

function Checklist({ audience, now }) {
  const s = useStore();
  const [edit, setEdit] = React.useState(false);
  const today = dayKey(now);
  const gestes = GESTES.filter(g => !(audience === 'enfant' && g.id === 'peroxyde'));
  const take = id => set(s0 => ({ intakes: [...s0.intakes, { g: id, t: Date.now() }].slice(-500) }));
  const undo = id => set(s0 => { const i = s0.intakes.map(x => x.g).lastIndexOf(id); return { intakes: s0.intakes.filter((_, k) => k !== i) }; });
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="clr-arms-t"><span aria-hidden="true">⚔️ </span>Tes armes du jour</p>
        <button type="button" className="clr-link" aria-expanded={edit} onClick={() => setEdit(e => !e)}>{edit ? 'Fermer les réglages' : 'Intervalles et rappels'}</button>
      </div>
      {audience === 'enfant' ? <p className="mt-1 text-xs text-muted">Profil Enfant : le gargarisme au peroxyde est retiré.</p> : null}
      {edit ? <Settings gestes={gestes} /> : null}
      <ul className="clr-list mt-2">
        {gestes.map((g, n) => {
          const all = s.intakes.filter(i => i.g === g.id && i.t >= s.protocol.start);
          const todays = all.filter(i => dayKey(i.t) === today);
          const last = all.at(-1);
          const next = last ? last.t + intervalOf(s, g.id) * 36e5 : null;
          const ready = !next || next <= now;
          return (
            <li key={g.id} className="clr-geste" data-geste={g.id}>
              <button type="button" className={cx('clr-check', todays.length && 'on')} aria-label={`${g.short} : j’ai pris`} onClick={() => take(g.id)}>
                {todays.length ? <span>✓{todays.length > 1 ? <small>{todays.length}</small> : null}</span> : null}
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{n + 1}. {g.short}</p>
                <p className="text-xs text-muted">{g.act} · aujourd’hui : {todays.length} fois</p>
                <p className={cx('text-xs', ready ? 'text-primary' : 'text-caution')}>
                  {last ? <>Dernière : {fmtTime(last.t)} · {ready ? 'possible maintenant' : `prochaine : ${fmtTime(next)}`}</> : 'Pas encore pris'}
                </p>
              </div>
              {last ? <button type="button" className="clr-link" aria-label={`Annuler la dernière prise : ${g.short}`} onClick={() => undo(g.id)}>Annuler</button> : null}
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted">Touche le rond quand c’est fait. Les intervalles servent de repère : toujours suivre l’étiquette du produit.</p>
    </div>
  );
}

function Settings({ gestes }) {
  const s = useStore();
  const [msg, setMsg] = React.useState('');
  const supported = typeof window !== 'undefined' && 'Notification' in window;
  const ios = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);
  const standalone = typeof window !== 'undefined' && (window.matchMedia?.('(display-mode: standalone)').matches || navigator.standalone);
  async function toggle() {
    if (s.reminders) { set(() => ({ reminders: false })); setMsg('Rappels désactivés.'); return; }
    if (!supported) { setMsg(ios && !standalone ? 'Sur iPhone, ajoute d’abord l’appli à l’écran d’accueil (Partager → Sur l’écran d’accueil), puis ouvre-la depuis l’icône.' : 'Ce navigateur ne permet pas les rappels.'); return; }
    const perm = Notification.permission === 'granted' ? 'granted' : await Notification.requestPermission();
    if (perm === 'granted') { set(() => ({ reminders: true })); setMsg('Rappels activés : une notification quand le prochain geste est possible.'); }
    else setMsg('Les notifications sont refusées dans les réglages du navigateur.');
  }
  return (
    <div className="clr-settings mt-2">
      {gestes.map(g => (
        <label key={g.id} className="clr-row text-sm">
          <span className="flex-1">{g.short}<br /><span className="text-xs text-muted">{g.hint}</span></span>
          <select value={intervalOf(s, g.id)} aria-label={`Intervalle pour ${g.short}`}
            onChange={e => { const v = Number(e.target.value); set(s0 => ({ intervals: { ...s0.intervals, [g.id]: v } })); }}>
            {[1, 2, 3, 4, 5, 6, 8, 10, 12, 24].map(v => <option key={v} value={v}>toutes les {v} h</option>)}
          </select>
        </label>
      ))}
      <div className="clr-row">
        <span className="flex-1 text-sm">Rappels<br /><span className="text-xs text-muted">Quand l’appli est ouverte ou en arrière-plan. {ios ? 'Sur iPhone : seulement depuis l’icône de l’écran d’accueil (iOS 16.4 et plus).' : ''}</span></span>
        <Btn variant={s.reminders ? 'primary' : 'ghost'} aria-pressed={!!s.reminders} onClick={toggle}>{s.reminders ? 'Activés' : 'Activer'}</Btn>
      </div>
      {msg ? <p className="text-xs text-muted" role="status">{msg}</p> : null}
    </div>
  );
}

// ---------- suivi des symptômes ----------
function Symptoms() {
  const s = useStore();
  const now = useNow();
  const hr = new Date(now).getHours();
  const [slot, setSlot] = React.useState(hr < 14 ? 'matin' : 'soir');
  const existing = s.checks.find(c => c.day === dayKey(now) && c.slot === slot && c.t >= s.protocol.start);
  const empty = { gorge: 5, fievre: false, frissons: false, tete: 'non', avaler: false, respirer: false };
  const [f, setF] = React.useState(existing ?? empty);
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => { setF(existing ?? empty); setSaved(false); }, [slot, existing?.t]);
  const save = () => {
    set(s0 => ({ checks: [...s0.checks.filter(c => !(c.day === dayKey() && c.slot === slot && c.t >= s0.protocol.start)),
      { gorge: f.gorge, fievre: f.fievre, frissons: f.frissons, tete: f.tete, avaler: f.avaler, respirer: f.respirer, day: dayKey(), slot, t: Date.now() }].slice(-200) }));
    setSaved(true);
  };
  const Toggle = ({ k, label }) => (
    <button type="button" aria-pressed={!!f[k]} className={cx('clr-chip', f[k] && 'on')} onClick={() => setF({ ...f, [k]: !f[k] })}>{label}</button>
  );
  return (
    <Card data-clr="point" id="point">
      <Kicker>Suivi matin et soir</Kicker>
      <h2 className="mt-1 text-xl">Comment ça va ?</h2>
      <div className="clr-seg mt-3" role="group" aria-label="Moment">
        {['matin', 'soir'].map(v => <button key={v} type="button" aria-pressed={slot === v} className={cx(slot === v && 'on')} onClick={() => setSlot(v)}>{v === 'matin' ? 'Matin' : 'Soir'}</button>)}
      </div>
      {slot === 'soir' ? <NightWarm day={protocolDay(s.protocol, now)} audience={s.protocol.audience} compact /> : null}
      <label className="mt-4 block text-sm font-medium" htmlFor="clr-gorge">Gorge : <span className="text-primary">{f.gorge}</span> / 10</label>
      <input id="clr-gorge" className="clr-range" type="range" min="0" max="10" step="1" value={f.gorge} onChange={e => setF({ ...f, gorge: Number(e.target.value) })} />
      <div className="flex justify-between text-xs text-muted"><span>0 : rien</span><span>10 : très douloureux</span></div>
      <p className="mt-3 text-sm font-medium">Fièvre (38 °C ou plus) ?</p>
      <div className="clr-seg mt-1" role="group" aria-label="Fièvre">
        <button type="button" aria-pressed={!f.fievre} className={cx(!f.fievre && 'on')} onClick={() => setF({ ...f, fievre: false })}>Non</button>
        <button type="button" aria-pressed={f.fievre} className={cx(f.fievre && 'on')} onClick={() => setF({ ...f, fievre: true })}>Oui</button>
      </div>
      <p className="mt-3 text-sm font-medium">Mal de tête</p>
      <div className="clr-seg mt-1" role="group" aria-label="Mal de tête">
        {[['non', 'Non'], ['oui', 'Léger'], ['intense', 'Intense']].map(([v, l]) => <button key={v} type="button" aria-pressed={f.tete === v} className={cx(f.tete === v && 'on')} onClick={() => setF({ ...f, tete: v })}>{l}</button>)}
      </div>
      <p className="mt-3 text-sm font-medium">Aussi</p>
      <div className="mt-1 flex flex-wrap gap-2">
        <Toggle k="frissons" label="Frissons" />
        <Toggle k="avaler" label="Difficulté à avaler" />
        <Toggle k="respirer" label="Difficulté à respirer" />
      </div>
      <Btn className="mt-4" onClick={save}>{existing ? 'Mettre à jour' : 'Enregistrer'} ({slot})</Btn>
      {saved ? <span className="clr-saved text-sm text-primary" role="status">Enregistré</span> : null}
      <Chart />
    </Card>
  );
}

function Chart() {
  const s = useStore();
  const p = s.protocol;
  const start = new Date(dayKey(p.start));
  const slots = [];
  for (let d = 0; d < PROTOCOL_DAYS; d++) for (const slot of ['matin', 'soir']) {
    const k = dayKey(start.getTime() + d * DAY + 12 * 36e5);
    slots.push({ d, slot, c: s.checks.find(c => c.day === k && c.slot === slot && c.t >= p.start) });
  }
  const W = 300, H = 120, L = 22, B = 22, T = 8;
  const x = i => L + (i + 0.5) * ((W - L - 4) / slots.length);
  const y = v => T + (10 - v) * ((H - T - B) / 10);
  const pts = slots.map((o, i) => o.c ? [x(i), y(o.c.gorge)] : null).filter(Boolean);
  return (
    <figure className="clr-chart mt-4" data-clr="graphique">
      <figcaption className="text-sm font-medium">Gorge sur 3 jours</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Gorge sur 3 jours : ${slots.map(o => o.c ? o.c.gorge : '–').join(', ')}`}>
        {[0, 5, 10].map(v => <g key={v}><line x1={L} x2={W - 4} y1={y(v)} y2={y(v)} className="grid" /><text x={L - 6} y={y(v) + 3} textAnchor="end">{v}</text></g>)}
        {[1, 2].map(d => <line key={d} x1={x(d * 2) - (W - L - 4) / slots.length / 2} x2={x(d * 2) - (W - L - 4) / slots.length / 2} y1={T} y2={H - B} className="sep" />)}
        {pts.length > 1 ? <polyline points={pts.map(p => p.join(',')).join(' ')} className="line" /> : null}
        {slots.map((o, i) => o.c ? <g key={i}>
          <circle cx={x(i)} cy={y(o.c.gorge)} r="4.5" className={cx('dot', (o.c.fievre || o.c.frissons) && 'warn')} />
          {o.c.fievre ? <text x={x(i)} y={y(o.c.gorge) - 8} textAnchor="middle" className="warn-t">fièvre</text> : null}
        </g> : null)}
        {[0, 1, 2].map(d => <text key={d} x={x(d * 2) + (W - L - 4) / slots.length / 2} y={H - 6} textAnchor="middle">Jour {d + 1}</text>)}
      </svg>
      <p className="text-xs text-muted">Points : matin puis soir. Point ambre : fièvre ou frissons notés.</p>
    </figure>
  );
}

// ---------- quand arrêter et consulter ----------
function CallButtons({ urgent }) {
  return (
    <div className="clr-calls mt-2 flex flex-wrap gap-2">
      <a className="clr-btn clr-call" href="tel:811">Appeler le 811</a>
      {urgent ? <a className="clr-btn clr-call" href="tel:911">Appeler le 911</a> : null}
    </div>
  );
}
function Consult({ setStance }) {
  const s = useStore();
  const a = assess(s);
  return (
    <Card caution data-clr="consulter" className={cx(a.urgent && 'clr-urgent')}>
      <p className="text-xs font-medium tracking-widest text-caution uppercase">Quand arrêter et consulter</p>
      {a.urgent ? (
        <div className="clr-alert mt-2" role="alert">
          <p className="font-semibold">Consulter rapidement.</p>
          <p className="mt-1 text-sm">Difficulté à avaler ou à respirer : appelle Info-Santé au 811 (Québec) ou consulte sans attendre. En cas d’urgence, fais le 911.</p>
          <CallButtons urgent />
        </div>
      ) : a.consult ? (
        <div className="clr-alert mt-2" role="alert">
          <p className="font-semibold">Il vaut mieux consulter.</p>
          <p className="mt-1 text-sm">{[...a.flags].filter(f => f !== 'tete').map(f => RED_FLAGS.find(r => r.id === f)?.label).filter(Boolean).join(', ')} : arrête la surchauffe et la tuque, et demande un avis (Info-Santé 811 au Québec).</p>
          <CallButtons />
        </div>
      ) : a.noWarm ? (
        <div className="clr-alert mt-2" role="status">
          <p className="font-semibold">Mal de tête noté : pas de surchauffe ni de tuque la nuit.</p>
          <p className="mt-1 text-sm">S’il devient intense, ou avec fièvre ou frissons, consulte.</p>
        </div>
      ) : null}
      {a.noWarm || a.consult ? <Btn className="mt-3" onClick={() => setStance('soutien')}>Passer au Mode Soutien</Btn> : null}
      <ul className="clr-flags mt-3">
        {RED_FLAGS.map(r => <li key={r.id} className={cx(a.flags.has(r.id) && 'on')}>{r.label}{r.urgent ? ' : consulter rapidement' : ''}</li>)}
      </ul>
      <p className="mt-2 text-xs text-muted">Info-Santé : 811 (Québec). Urgence : 911. Ces informations sont éducatives et ne remplacent pas un avis médical.</p>
    </Card>
  );
}

// ---------- kit combat ----------
function Kit() {
  const s = useStore();
  const has = new Set(s.kit);
  const tog = id => set(s0 => ({ kit: s0.kit.includes(id) ? s0.kit.filter(k => k !== id) : [...s0.kit, id] }));
  return (
    <Card data-clr="kit">
      <div className="flex items-center justify-between gap-3">
        <div><Kicker><span aria-hidden="true">🛡️ </span>Arsenal · à préparer d’avance</Kicker><h2 className="mt-1 text-xl">Kit Combat</h2></div>
        <span className="clr-count text-sm text-primary">{has.size} / {KIT.length}</span>
      </div>
      <ul className="clr-kit mt-3">
        {KIT.map(k => (
          <li key={k.id}><label><input type="checkbox" checked={has.has(k.id)} onChange={() => tog(k.id)} /> <span className="text-sm">{k.label}</span></label></li>
        ))}
      </ul>
    </Card>
  );
}

function CheckSummary() {
  const s = useStore();
  const setTab = useNav(n => n.setTab);
  const last = s.checks.filter(c => c.t >= s.protocol.start).sort((a, b) => a.t - b.t).at(-1);
  return (
    <Card data-clr="symptomes">
      <Kicker>Suivi matin et soir</Kicker>
      <h2 className="mt-1 text-xl">Comment ça va ?</h2>
      <p className="mt-2 text-sm text-muted">{last
        ? `Dernier point : ${last.slot}, ${fmtDate(last.t)} à ${fmtTime(last.t)} · gorge ${last.gorge}/10${last.fievre ? ' · fièvre' : ''}.`
        : 'Aucun point noté pour ce protocole.'} Le point matin et soir et le journal sont réunis dans l’onglet Suivi.</p>
      <Btn className="mt-3" onClick={() => setTab('suivi')}>Faire le point dans Suivi</Btn>
    </Card>
  );
}

function Panel({ audience, setStance }) {
  const s = useStore();
  return (
    <div className="clr-panel" data-clr="panel">
      <Protocol audience={audience} />
      <Consult setStance={setStance} />
      {s.protocol ? <CheckSummary /> : null}
      <Kit />
    </div>
  );
}

function GesteExtra({ id, audience }) {
  const list = PRECAUTIONS[audience === 'enfant' ? 'enfant' : 'adulte'][id];
  if (!list) return null;
  return (
    <div className="clr-prec mt-3" data-clr="precautions">
      <p className="text-xs font-medium text-caution uppercase tracking-wide">Précautions</p>
      <ul>{list.map(t => <li key={t} className="text-sm">{t}</li>)}</ul>
    </div>
  );
}


// ---------- Mode Combat concentré ----------
function ModeSwitch({ onAll, setStance }) {
  return (
    <Card data-clr="changer-mode">
      <Kicker>Changer de mode</Kicker>
      <p className="mt-1 text-sm text-muted">Le Mode Combat ne montre que le protocole du mal de gorge. Plantes, vitamines et recettes sont dans le Mode Soutien ou dans la liste complète.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Btn onClick={() => setStance('soutien')}>Passer au Mode Soutien</Btn>
        <Btn variant="ghost" onClick={() => { setStance(null); onAll?.(); }}>Voir tous les remèdes</Btn>
      </div>
    </Card>
  );
}

function HomeCombatInner({ onOpen, onAll, setStance }) {
  const s = useStore();
  const now = useNow();
  const p = s.protocol;
  const done = p ? new Set(s.intakes.filter(i => i.t >= p.start && dayKey(i.t) === dayKey(now)).map(i => i.g)).size : 0;
  const total = p && p.audience === 'enfant' ? 4 : 5;
  return (
    <div className="clr-panel" data-clr="accueil-combat">
      <Card>
        <Kicker><span aria-hidden="true">🎯 </span>{p ? 'Plan d’attaque en cours' : 'Plan d’attaque · 3 jours'}</Kicker>
        {p ? <>
          <h2 className="mt-1 text-xl">{protocolDay(p, now) > PROTOCOL_DAYS ? 'Les 3 jours sont passés' : `Jour ${protocolDay(p, now)} sur ${PROTOCOL_DAYS}`}</h2>
          {protocolDay(p, now) > PROTOCOL_DAYS ? null : <p className="clr-phase">Jour {protocolDay(p, now)} : {PHASE_NAMES[protocolDay(p, now) - 1]}</p>}
          <p className="mt-1 text-sm text-muted">Gestes faits aujourd’hui : {done} sur {total}. Commencé le {fmtDate(p.start)} à {fmtTime(p.start)}.</p>
          <NightWarm day={protocolDay(p, now)} audience={p.audience} compact />
          <Btn className="clr-btn-big mt-4" onClick={onOpen}>Ouvrir mon protocole</Btn>
        </> : <>
          <h2 className="mt-1 text-xl">Dès le premier mal de gorge, on attaque</h2>
          <p className="mt-2 text-sm text-muted">Tes cinq armes du jour, un point matin et soir sur les symptômes, et le Kit Combat.</p>
          <Btn className="clr-btn-big clr-pulse mt-4" onClick={() => { set(() => ({ protocol: { start: Date.now(), audience: prefsAudience() } })); onOpen(); }}>J’ai mal à la gorge, je commence</Btn>
        </>}
      </Card>
      <Consult setStance={setStance} />
      <ModeSwitch onAll={onAll} setStance={setStance} />
    </div>
  );
}

const WARM_ITEMS = ['Dormir au chaud', 'Rester au chaud'];
const KEEP_ITEMS = [...WARM_ITEMS, 'Surveiller la température', 'Miel :'];
function CombatAdviceInner({ consult, during, onAll, setStance }) {
  const s = useStore();
  const a = assess(s);
  const items = (during || []).filter(t => KEEP_ITEMS.some(k => t.startsWith(k)) && !(a.noWarm && WARM_ITEMS.some(k => t.startsWith(k))));
  return (
    <div className="space-y-4" data-clr="conseils-combat">
      <div>
        <h1 className="text-2xl">Conseils · Mode Combat</h1>
        <p className="mt-1 text-sm text-muted">Seulement ce qui concerne le protocole du mal de gorge.</p>
      </div>
      <Consult setStance={setStance} />
      <Card caution>
        <h2 className="text-xl text-caution">Quand consulter</h2>
        <ul className="clr-dots mt-3">{(consult || []).map(t => <li key={t} className="text-sm">{t}</li>)}</ul>
      </Card>
      <Card>
        <h2 className="text-xl">Pendant le combat</h2>
        <ul className="clr-dots mt-3">{items.map(t => <li key={t} className="text-sm text-ink">{t}</li>)}</ul>
        {a.noWarm ? <p className="mt-2 text-xs text-muted">Fièvre, frissons ou mal de tête notés : les conseils « au chaud » sont masqués.</p> : null}
      </Card>
      <RefCard />
      <ModeSwitch onAll={onAll} setStance={setStance} />
    </div>
  );
}

const withStance = C => props => <C {...props} setStance={setStanceGlobal} />;
export const CombatPanel = withStance(Panel);
export const CombatModeSwitch = withStance(ModeSwitch);
export const HomeCombat = withStance(HomeCombatInner);
export const CombatAdvice = withStance(CombatAdviceInner);
export { Subtitle as CombatSubtitle, HomeWarm, GesteExtra, Symptoms as CombatCheck };
export const CombatConsult = withStance(Consult);
export { assess as assessCombat, useStore as useCombatData };
if (typeof window !== 'undefined') setTimeout(scheduleReminders, 0);
