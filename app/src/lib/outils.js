import { DOSES_ENFANT } from "../data/contenu.js";

export function dayKey(e = new Date()) {
  return `${e.getFullYear()}-${String(e.getMonth() + 1).padStart(2, `0`)}-${String(e.getDate()).padStart(2, `0`)}`;
}

export function emptyEntry(e = dayKey()) {
  return {
    date: e,
    intensity: 4,
    symptoms: [],
    notes: ``,
    protocol: [],
  };
}

export function lastDays(e, t = new Date()) {
  let n = [];
  for (let r = e - 1; r >= 0; --r) {
    let e = new Date(t);
    (e.setDate(t.getDate() - r), n.push(dayKey(e)));
  }
  return n;
}

export function protocoleSelonSymptomes(e) {
  if (e.length === 0) return [];
  let t = [
    `Frapper fort dès les premiers signes, surtout le mal de gorge.`,
    `Hydratation 2,5 à 3 L. Très au chaud la nuit, tuque comprise, s’il n’y a pas de fièvre, de mal de tête ou de frissons.`,
    `Vitamine D en priorité. La plupart des gens en ont besoin, surtout au Québec en automne et en hiver.`,
  ];
  return (
    e.includes(`fievre`) &&
      t.push(`Zinc, plus sureau ou échinacée. Surveiller la température.`),
    e.includes(`toux`) && t.push(`Thym et miel-citron. Repos de la voix.`),
    e.includes(`congestion`) &&
      t.push(`Lavage nasal salin, 1 à 3 fois par jour.`),
    e.includes(`gorge`) &&
      t.push(`Gargarismes et miel. Jamais d’ustensile en métal.`),
    e.includes(`fatigue`) &&
      t.push(
        `Repos prioritaire. Vitamines C et D. Probiotiques plutôt en convalescence.`,
      ),
    t.push(`Éviter l’alcool.`),
    t
  );
}

export function doseEnfant(e) {
  return DOSES_ENFANT[e] ?? `Pas la dose adulte. À adapter à l’âge.`;
}

export function todayKey() {
  let e = new Date(),
    t = String(e.getMonth() + 1).padStart(2, `0`),
    n = String(e.getDate()).padStart(2, `0`);
  return `${e.getFullYear()}-${t}-${n}`;
}

export function normaliser(e) {
  return e
    .toLowerCase()
    .normalize(`NFD`)
    .replace(/\p{Diacritic}/gu, ``);
}

export function formatJour(e) {
  let [t, n, r] = e.split(`-`).map(Number);
  return new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" }).format(new Date(t, (n ?? 1) - 1, r ?? 1));
}
