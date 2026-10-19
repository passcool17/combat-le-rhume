// Suivi unifié : journal quotidien + point matin et soir + protocole Combat, dans une seule clé.
// Migration sans perte depuis les anciennes clés (laissées en place comme copie de secours).
import { create } from "zustand";
import { JOURNAL_KEY } from "../data/contenu.js";

export const SUIVI_KEY = `combat-le-rhume-suivi-v1`;
export const COMBAT_KEY = `combat-le-rhume-combat-v1`;
export const VERSION = 1;

export const blank = () => ({
  version: VERSION,
  journal: [],
  checks: [],
  protocol: null,
  intakes: [],
  intervals: {},
  kit: [],
  reminders: false,
  history: [],
});

const isObj = (v) => !!v && typeof v === `object` && !Array.isArray(v);
const isDay = (v) => typeof v === `string` && /^\d{4}-\d{2}-\d{2}$/.test(v);
const isNum = (v) => typeof v === `number` && Number.isFinite(v);
const strings = (v) => Array.isArray(v) && v.every((x) => typeof x === `string`);

export function isEntry(e) {
  return (
    isObj(e) &&
    isDay(e.date) &&
    isNum(e.intensity) &&
    strings(e.symptoms) &&
    typeof e.notes === `string` &&
    strings(e.protocol)
  );
}
const isCheck = (c) =>
  isObj(c) &&
  isDay(c.day) &&
  (c.slot === `matin` || c.slot === `soir`) &&
  isNum(c.t) &&
  isNum(c.gorge) &&
  [`non`, `oui`, `intense`].includes(c.tete) &&
  [`fievre`, `frissons`, `avaler`, `respirer`].every((k) => typeof c[k] === `boolean`);
const isIntake = (i) => isObj(i) && typeof i.g === `string` && isNum(i.t);
const isProtocol = (p) =>
  p === null || (isObj(p) && isNum(p.start) && (p.audience === `adulte` || p.audience === `enfant`));
const isHistory = (h) =>
  isObj(h) && isNum(h.start) && isNum(h.end) && (h.status === `termine` || h.status === `annule`);

/** Valide des données importées. Retourne { ok, data, errors }. */
export function validate(raw) {
  const errors = [];
  let d = raw;
  if (isObj(d) && d.app === `combat-le-rhume` && isObj(d.data)) d = d.data;
  if (!isObj(d)) return { ok: false, errors: [`Le fichier ne contient pas un objet JSON.`] };
  if (d.version !== VERSION) errors.push(`Version de données inconnue (${d.version ?? `absente`}).`);
  const check = (k, ok, label) => {
    if (d[k] !== undefined && !ok(d[k])) errors.push(`Champ « ${k} » invalide (${label}).`);
  };
  check(`journal`, (v) => Array.isArray(v) && v.every(isEntry), `journées`);
  check(`checks`, (v) => Array.isArray(v) && v.every(isCheck), `points matin et soir`);
  check(`protocol`, isProtocol, `protocole`);
  check(`intakes`, (v) => Array.isArray(v) && v.every(isIntake), `gestes`);
  check(`intervals`, (v) => isObj(v) && Object.values(v).every(isNum), `intervalles`);
  check(`kit`, strings, `Kit Combat`);
  check(`reminders`, (v) => typeof v === `boolean`, `rappels`);
  check(`history`, (v) => Array.isArray(v) && v.every(isHistory), `historique`);
  if (errors.length) return { ok: false, errors };
  const data = { ...blank() };
  for (const k of Object.keys(data)) if (d[k] !== undefined) data[k] = d[k];
  data.version = VERSION;
  return { ok: true, data, errors: [] };
}

function readJSON(key) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : null;
  } catch {
    return null;
  }
}

/** Construit les données unifiées à partir des deux anciennes clés. */
export function migrate(oldJournal, oldCombat) {
  const data = blank();
  if (Array.isArray(oldJournal)) data.journal = oldJournal.filter(isEntry);
  if (isObj(oldCombat)) {
    if (isProtocol(oldCombat.protocol ?? null)) data.protocol = oldCombat.protocol ?? null;
    for (const [k, ok] of [
      [`checks`, isCheck],
      [`intakes`, isIntake],
      [`history`, isHistory],
    ])
      if (Array.isArray(oldCombat[k])) data[k] = oldCombat[k].filter(ok);
    if (isObj(oldCombat.intervals)) data.intervals = Object.fromEntries(Object.entries(oldCombat.intervals).filter(([, v]) => isNum(v)));
    if (strings(oldCombat.kit)) data.kit = oldCombat.kit;
    data.reminders = oldCombat.reminders === true;
  }
  data.journal.sort((a, b) => b.date.localeCompare(a.date));
  return data;
}

export function loadSuivi() {
  if (typeof window === `undefined`) return blank();
  const cur = readJSON(SUIVI_KEY);
  if (cur) {
    const v = validate(cur);
    if (v.ok) return v.data;
    // données abîmées : on garde ce qui est valide, champ par champ
    return migrate(cur.journal, cur);
  }
  const data = migrate(readJSON(JOURNAL_KEY), readJSON(COMBAT_KEY));
  try {
    localStorage.setItem(SUIVI_KEY, JSON.stringify(data));
  } catch {}
  return data;
}

function persist(data) {
  try {
    localStorage.setItem(SUIVI_KEY, JSON.stringify(data));
  } catch {}
}

export const dayKey = (t = Date.now()) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, `0`)}-${String(d.getDate()).padStart(2, `0`)}`;
};
const emptyEntry = (date) => ({ date, intensity: 4, symptoms: [], notes: ``, protocol: [] });

export const useSuivi = create((set, get) => {
  const commit = (data) => {
    persist(data);
    set({ data, entries: data.journal });
  };
  const initial = loadSuivi();
  return {
    hydrated: true,
    data: initial,
    entries: initial.journal,
    hydrate: () => {},
    /** Mise à jour partielle (utilisée par le Mode Combat). */
    update: (fn) => commit({ ...get().data, ...fn(get().data) }),
    replaceAll: (data) => commit({ ...blank(), ...data }),
    clearAll: () => {
      for (const k of [SUIVI_KEY, JOURNAL_KEY, COMBAT_KEY]) {
        try {
          localStorage.removeItem(k);
        } catch {}
      }
      commit(blank());
    },
    saveToday: (patch) => {
      const date = dayKey();
      const list = get().data.journal;
      const journal = [
        { ...(list.find((e) => e.date === date) ?? emptyEntry(date)), ...patch, date },
        ...list.filter((e) => e.date !== date),
      ].sort((a, b) => b.date.localeCompare(a.date));
      commit({ ...get().data, journal });
    },
    toggleProtocol: (id) => {
      const date = dayKey();
      const cur = get().data.journal.find((e) => e.date === date) ?? emptyEntry(date);
      const protocol = cur.protocol.includes(id) ? cur.protocol.filter((x) => x !== id) : [...cur.protocol, id];
      get().saveToday({ ...cur, protocol });
    },
    remove: (date) =>
      commit({ ...get().data, journal: get().data.journal.filter((e) => e.date !== date) }),
  };
});

// Alias pour le code d'origine (journal quotidien).
export const useJournal = useSuivi;

// ---------- export ----------
export function toJSON(data) {
  return JSON.stringify({ app: `combat-le-rhume`, version: VERSION, exportedAt: new Date().toISOString(), data }, null, 2);
}

const csvCell = (v) => {
  const s = v === undefined || v === null ? `` : String(v);
  return /[";\n\r]/.test(s) ? `"${s.replace(/"/g, `""`)}"` : s;
};
const hhmm = (t) => {
  const d = new Date(t);
  return `${String(d.getHours()).padStart(2, `0`)}:${String(d.getMinutes()).padStart(2, `0`)}`;
};
const ouiNon = (b) => (b ? `oui` : `non`);

export function toCSV(data, labels = {}) {
  const head = [`type`, `date`, `moment`, `heure`, `intensite`, `gorge`, `fievre`, `frissons`, `mal_de_tete`, `difficulte_avaler`, `difficulte_respirer`, `symptomes`, `protocole_du_jour`, `notes`, `geste`];
  const rows = [];
  for (const e of [...data.journal].sort((a, b) => a.date.localeCompare(b.date)))
    rows.push({ type: `journal`, date: e.date, intensite: e.intensity, symptomes: e.symptoms.map((s) => labels[s] ?? s).join(`, `), protocole_du_jour: e.protocol.join(`, `), notes: e.notes });
  for (const c of [...data.checks].sort((a, b) => a.t - b.t))
    rows.push({ type: `point`, date: c.day, moment: c.slot, heure: hhmm(c.t), gorge: c.gorge, fievre: ouiNon(c.fievre), frissons: ouiNon(c.frissons), mal_de_tete: c.tete === `oui` ? `léger` : c.tete, difficulte_avaler: ouiNon(c.avaler), difficulte_respirer: ouiNon(c.respirer) });
  for (const i of [...data.intakes].sort((a, b) => a.t - b.t))
    rows.push({ type: `geste`, date: dayKey(i.t), heure: hhmm(i.t), geste: i.g });
  for (const h of data.history)
    rows.push({ type: `protocole`, date: dayKey(h.start), heure: hhmm(h.start), notes: `${h.status === `termine` ? `terminé` : `annulé`} le ${dayKey(h.end)}` });
  if (data.protocol) rows.push({ type: `protocole`, date: dayKey(data.protocol.start), heure: hhmm(data.protocol.start), notes: `en cours (${data.protocol.audience})` });
  return `\uFEFF` + [head.join(`;`), ...rows.map((r) => head.map((k) => csvCell(r[k])).join(`;`))].join(`\r\n`) + `\r\n`;
}

export function download(name, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement(`a`);
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
