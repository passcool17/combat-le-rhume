// Bloc Références mis en avant sur l’accueil (les deux modes, thèmes clair et sombre).
import { useNav } from "../lib/nav.js";
import { ETUDE_COUNT, INTL_META, MEDECIN_COUNT, REF_COUNT, REF_GROUP_META, REF_HIGHLIGHTS } from "../data/refs-meta.js";

const initiales = (nom) =>
  nom
    .replace(/^(Dr\.?|Prof\.?)\s+/i, ``)
    .split(/[ ,]+/)
    .filter((m) => /^[A-ZÀ-Ý]/.test(m) && !/^(M\.?D\.?|MD|D\.O\.)$/.test(m))
    .slice(0, 2)
    .map((m) => m[0])
    .join(``);
const titreGroupe = (id) => REF_GROUP_META.find((g) => g.id === id)?.title ?? ``;

export function HomeRefs() {
  const openReferences = useNav((n) => n.openReferences);
  const stats = [
    { n: REF_COUNT, l: `publications de médecins sur X`, k: `x` },
    { n: MEDECIN_COUNT, l: `médecins`, k: `medecins` },
    { n: ETUDE_COUNT, l: `études scientifiques`, k: `etudes` },
  ];
  return (
    <section className="clr-refs-home" data-clr="accueil-references" aria-labelledby="accueil-refs-t">
      <p className="clr-refs-home-k"><span aria-hidden="true">🩺 </span>Appuyé par des médecins et la science</p>
      <h2 id="accueil-refs-t" className="mt-1 text-2xl">Les références derrière l’appli</h2>
      <p className="mt-1 text-sm text-muted">Chaque conseil de l’appli s’appuie sur des publications de médecins et des études. Tout est vérifié, avec le lien d’origine.</p>
      <ul className="clr-refs-stats mt-4" aria-label="Les références en chiffres">
        {stats.map((s) => (
          <li key={s.k} data-stat={s.k}>
            <span className="clr-refs-stat-n">{s.n}</span>
            <span className="clr-refs-stat-l">{s.l}</span>
          </li>
        ))}
      </ul>
      <p className="clr-refs-intl mt-3 text-sm text-ink" data-clr="accueil-international"><span aria-hidden="true">🌍 </span>Dont {INTL_META.posts + INTL_META.etudes} références internationales : {INTL_META.langues} langues, {INTL_META.pays} pays, traduites en français.</p>
      <p className="mt-4 text-xs font-semibold tracking-widest text-primary uppercase">Ce qu’ils disent <span className="font-normal normal-case tracking-normal text-muted md:hidden">· glisse pour voir les {REF_HIGHLIGHTS.length}</span></p>
      <ul className="clr-refs-quotes mt-2" aria-label="Publications mises en avant">
        {REF_HIGHLIGHTS.map((h) => (
          <li key={h.n} className="clr-refs-quote" data-highlight={h.n}>
            <div className="flex items-center gap-3">
              <span className="clr-refs-av" aria-hidden="true">{initiales(h.name)}</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{h.name}</p>
                <p className="text-xs text-muted">{h.handle} · {titreGroupe(h.group)}</p>
              </div>
            </div>
            <blockquote className="mt-2 text-sm text-ink">« {h.gist} »</blockquote>
            <div className="mt-auto flex flex-wrap gap-x-4 pt-1">
              <a className="clr-ref-cta" href={h.url} target="_blank" rel="noopener noreferrer">Voir sur X</a>
              <button type="button" className="clr-ref-cta text-left" data-home-ref={h.group} onClick={() => openReferences(h.group)}>
                {`Références : ${titreGroupe(h.group)}`}
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" className="clr-refs-home-btn mt-4" data-clr="accueil-references-btn" onClick={() => openReferences(null)}>
        Voir toutes les références <span aria-hidden="true">→</span>
      </button>
      <p className="mt-2 text-xs text-muted">{REF_COUNT} publications et {ETUDE_COUNT} études, regroupées par remède. Elles ne remplacent pas un avis médical.</p>
    </section>
  );
}
