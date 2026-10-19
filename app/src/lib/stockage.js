import { PREFS_KEY } from "../data/contenu.js";
export { useJournal, useSuivi } from "./suivi.js";
import { create } from "zustand";

export function loadPrefs() {
  let e = {
    audience: `adulte`,
    favorites: [],
    theme: `clair`,
    stance: null,
    onboarded: false,
    installDismissed: false,
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
      onboarded: r.onboarded === true,
      installDismissed: r.installDismissed === true,
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
    onboarded: t.onboarded ?? n.onboarded,
    installDismissed: t.installDismissed ?? n.installDismissed,
  };
}

export const usePrefs = create((e, t) => ({
  // Lecture synchrone : pas de « flash » de l’accueil sans mode pour les habitués.
  ...loadPrefs(),
  hydrated: true,
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
  setOnboarded: (v = true) => {
    let r = mergePrefs(t, { onboarded: v });
    (savePrefs(r), e({ ...r, hydrated: true }));
  },
  dismissInstall: () => {
    let r = mergePrefs(t, { installDismissed: true });
    (savePrefs(r), e({ ...r, hydrated: true }));
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
