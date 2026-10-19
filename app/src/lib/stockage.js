import { JOURNAL_KEY, PREFS_KEY } from "../data/contenu.js";
import { create } from "zustand";
import { dayKey, emptyEntry } from "./outils.js";

export function loadJournal() {
  if (typeof window > `u`) return [];
  try {
    let e = localStorage.getItem(JOURNAL_KEY);
    if (!e) return [];
    let t = JSON.parse(e);
    return Array.isArray(t) ? t.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function isEntry(e) {
  if (!e || typeof e != `object`) return false;
  let t = e;
  return (
    typeof t.date == `string` &&
    typeof t.intensity == `number` &&
    Array.isArray(t.symptoms) &&
    typeof t.notes == `string` &&
    Array.isArray(t.protocol)
  );
}

export function saveJournal(e) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(e));
}

export function loadPrefs() {
  let e = {
    audience: `adulte`,
    favorites: [],
    theme: `clair`,
    stance: null,
  };
  if (typeof window > `u`) return e;
  try {
    let t = localStorage.getItem(PREFS_KEY);
    if (!t) return e;
    let n = JSON.parse(t);
    if (!n || typeof n != `object`) return e;
    let r = n;
    return {
      audience: r.audience === `enfant` ? `enfant` : `adulte`,
      favorites: Array.isArray(r.favorites)
        ? r.favorites.filter((e) => typeof e == `string`)
        : [],
      theme: r.theme === `sombre` ? `sombre` : `clair`,
      stance: r.stance === `combat` || r.stance === `soutien` ? r.stance : null,
    };
  } catch {
    return e;
  }
}

export function savePrefs(e) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(e));
}

export function mergePrefs(e, t) {
  let n = e();
  return {
    audience: t.audience ?? n.audience,
    favorites: t.favorites ?? n.favorites,
    theme: t.theme ?? n.theme,
    stance: t.stance === void 0 ? n.stance : t.stance,
  };
}

export const useJournal = create((e, t) => ({
  hydrated: false,
  entries: [],
  hydrate: () => {
    t().hydrated ||
      e({
        entries: loadJournal(),
        hydrated: true,
      });
  },
  saveToday: (n) => {
    let r = dayKey(),
      i = t().hydrated ? t().entries : loadJournal(),
      a = [
        {
          ...(i.find((e) => e.date === r) ?? emptyEntry(r)),
          ...n,
          date: r,
        },
        ...i.filter((e) => e.date !== r),
      ].sort((e, t) => t.date.localeCompare(e.date));
    (saveJournal(a),
      e({
        entries: a,
        hydrated: true,
      }));
  },
  toggleProtocol: (e) => {
    let n = dayKey(),
      r =
        (t().hydrated ? t().entries : loadJournal()).find(
          (e) => e.date === n,
        ) ?? emptyEntry(n),
      i = r.protocol.includes(e)
        ? r.protocol.filter((t) => t !== e)
        : [...r.protocol, e];
    t().saveToday({
      ...r,
      protocol: i,
    });
  },
  remove: (n) => {
    let r = (t().hydrated ? t().entries : loadJournal()).filter(
      (e) => e.date !== n,
    );
    (saveJournal(r),
      e({
        entries: r,
        hydrated: true,
      }));
  },
}));

export const usePrefs = create((e, t) => ({
  hydrated: false,
  audience: `adulte`,
  favorites: [],
  theme: `clair`,
  stance: null,
  hydrate: () => {
    t().hydrated ||
      e({
        ...loadPrefs(),
        hydrated: true,
      });
  },
  setAudience: (n) => {
    let r = mergePrefs(t, {
      audience: n,
    });
    (savePrefs(r),
      e({
        ...r,
        hydrated: true,
      }));
  },
  setTheme: (n) => {
    let r = mergePrefs(t, {
      theme: n,
    });
    (savePrefs(r),
      e({
        ...r,
        hydrated: true,
      }));
  },
  setStance: (n) => {
    let r = mergePrefs(t, {
      stance: n,
    });
    (savePrefs(r),
      e({
        ...r,
        hydrated: true,
      }));
  },
  toggleFavorite: (n) => {
    let r = t().favorites,
      i = mergePrefs(t, {
        favorites: r.includes(n) ? r.filter((e) => e !== n) : [n, ...r],
      });
    (savePrefs(i),
      e({
        ...i,
        hydrated: true,
      }));
  },
}));
