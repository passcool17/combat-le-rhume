// Références : publications publiques de médecins sur X qui appuient les conseils de l’appli.
import { useEffect } from "react";
import { usePrefs } from "../lib/stockage.js";
import { useNav } from "../lib/nav.js";
import { ETUDES_CHALEUR, NUANCES_CHALEUR, REFERENCES, REF_GROUPS } from "../data/references.js";
import { Card, OnThisPage } from "../components/ui.jsx";
import { cn } from "../lib/cn.js";

const BADGES = {
  direct: { label: `Appuie directement`, cls: `clr-ref-b-direct` },
  partiel: { label: `Appuie en partie`, cls: `clr-ref-b-partiel` },
  lien: { label: `En lien`, cls: `clr-ref-b-lien` },
  nuance: { label: `Nuance`, cls: `clr-ref-b-warn` },
};
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(`fr-CA`, { day: `numeric`, month: `long`, year: `numeric`, timeZone: `America/Toronto` });
const precision = (s) => {
  const m = s.match(/\((.*)\)/) || s.match(/—\s*(.*)$/);
  return m ? m[1].charAt(0).toUpperCase() + m[1].slice(1) : null;
};
const byN = Object.fromEntries(REFERENCES.map((r) => [r.n, r]));

export function References() {
  const stance = usePrefs((e) => e.stance);
  const anchor = useNav((n) => n.refAnchor);
  useEffect(() => {
    if (!anchor) return;
    const t = setTimeout(() => document.getElementById(`ref-${anchor}`)?.scrollIntoView({ block: `start` }), 60);
    return () => clearTimeout(t);
  }, [anchor]);
  return (
    <div className="space-y-5" data-clr="references">
      <div className={cn(stance === `combat` ? `clr-hero-combat` : stance === `soutien` ? `clr-hero-soutien rounded-[var(--radius-card)] px-4 py-4` : ``)}>
        <p className={stance === `combat` ? `clr-hero-k` : `text-xs font-medium tracking-widest text-muted uppercase`}>
          {stance === `combat` ? <><span aria-hidden="true">🎯 </span>Renseignements</> : `Sources`}
        </p>
        <h1 className={stance === `combat` ? `clr-hero-t` : `mt-1 text-2xl`}>Références</h1>
        <p className={stance === `combat` ? `clr-hero-s` : `mt-1 text-sm text-muted`}>
          Publications publiques de médecins sur X, liées aux conseils de l’appli : {REFERENCES.length} publications, regroupées par remède, et {ETUDES_CHALEUR.length} études scientifiques sur la chaleur du corps. Elles ne remplacent pas un avis médical.
        </p>
      </div>
      <Card className="p-4" data-clr="ref-limites">
        <h2 className="text-lg">À savoir</h2>
        <ul className="mt-2 space-y-2 text-sm text-ink">
          <li>Le rôle de la chaleur du corps et de la fièvre contre l’infection est bien documenté : {REF_GROUPS.find((g) => g.id === `chaleur`).items.length} publications et {ETUDES_CHALEUR.length} études dans <a className="clr-ref-a" href="#ref-chaleur" onClick={(e) => { e.preventDefault(); document.getElementById(`ref-chaleur`)?.scrollIntoView(); }}>Chaleur du corps et fièvre</a>. Par contre, aucune source ne teste directement le fait de bien se couvrir la nuit pendant un rhume : c’est une extrapolation.</li>
          <li>Aucune publication de médecin ne recommande de doubler exactement la vitamine C. La plus proche est dans <a className="clr-ref-a" href="#ref-vitamine-c" onClick={(e) => { e.preventDefault(); document.getElementById(`ref-vitamine-c`)?.scrollIntoView(); }}>Vitamine C</a>.</li>
          <li>Badges : <span className="clr-ref-b clr-ref-b-direct">Appuie directement</span> <span className="clr-ref-b clr-ref-b-partiel">Appuie en partie</span> <span className="clr-ref-b clr-ref-b-lien">En lien</span> <span className="clr-ref-b clr-ref-b-warn">Nuance</span></li>
          <li className="text-muted">Citations en anglais telles que publiées, avec un résumé en français. Dates à l’heure de Toronto.</li>
        </ul>
      </Card>
      <OnThisPage items={REF_GROUPS.map((g) => ({ id: `ref-${g.id}`, label: `${g.title} (${g.items.length})` }))} />
      {REF_GROUPS.map((g) => (
        <section key={g.id} id={`ref-${g.id}`} data-ref-group={g.id} className="scroll-mt-40 space-y-3" aria-labelledby={`ref-${g.id}-t`}>
          <h2 id={`ref-${g.id}-t`} className="text-xl">{g.title}</h2>
          <ul className="space-y-3">
            {g.items.map((n) => {
              const r = byN[n];
              const b = BADGES[r.level];
              const p = precision(r.supportNote);
              return (
                <li key={n} className="rounded-[var(--radius-card)] border border-line bg-surface p-4" data-ref={n}>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-ink">{r.name}</h3>
                      <p className="text-sm text-muted">{r.handle}</p>
                    </div>
                    <span className={cn(`clr-ref-b`, b.cls)} data-badge={r.level}>{b.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    {r.notPhysician ? <span className="clr-ref-b clr-ref-b-warn mr-1" data-clr="pas-medecin">PhD, pas médecin</span> : null}
                    {r.credential}
                  </p>
                  <p className="mt-3 text-sm"><span className="font-medium">Conseil de l’appli : </span>{r.claim}</p>
                  <p className="mt-2 text-sm text-ink">{r.gist}</p>
                  <blockquote lang="en" className="clr-ref-q mt-2 text-sm">« {r.quote} »</blockquote>
                  {p ? <p className="mt-2 text-xs text-muted">Précision : {p}</p> : null}
                  {r.note ? <p className="clr-ref-note mt-2 text-xs" data-clr="ref-note">{r.note}</p> : null}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-muted">Publié le {fmtDate(r.date)}</p>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="clr-ref-link" aria-label={`Voir la publication sur X de ${r.name} (${g.title}, ${fmtDate(r.date)}), nouvel onglet`}>
                      Voir la publication sur X
                    </a>
                  </div>
                </li>
              );
            })}
          </ul>
          {g.id === `chaleur` ? <ChaleurExtra /> : null}
        </section>
      ))}
    </div>
  );
}

function ChaleurExtra() {
  return (
    <>
      <div className="clr-ref-note rounded-[var(--radius-card)] p-4 text-sm" data-clr="nuances-chaleur">
        <h3 className="text-base font-semibold">Nuances</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {NUANCES_CHALEUR.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </div>
      <h3 id="ref-chaleur-etudes" className="pt-2 text-lg font-semibold">Études scientifiques</h3>
      <ul className="space-y-3" aria-labelledby="ref-chaleur-etudes">
        {ETUDES_CHALEUR.map((e) => {
          const b = BADGES[e.level];
          const p = precision(e.supportNote);
          return (
            <li key={e.doi} className="rounded-[var(--radius-card)] border border-line bg-surface p-4" data-etude={e.n}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p lang="en" className="min-w-0 flex-1 text-base font-semibold text-ink">{e.title}</p>
                <span className={cn(`clr-ref-b`, b.cls)} data-badge={e.level}>{b.label}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{e.authors}</p>
              <p className="mt-1 text-sm"><span lang="en" className="italic">{e.journal}</span>, {e.year}</p>
              <p className="mt-2 text-sm text-ink">{e.finding}</p>
              {p ? <p className="mt-2 text-xs text-muted">Précision : {p}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={e.doiUrl} target="_blank" rel="noopener noreferrer" className="clr-ref-link" data-doi={e.doi} aria-label={`DOI ${e.doi} (nouvel onglet)`}>DOI : {e.doi}</a>
                <a href={e.pubmed} target="_blank" rel="noopener noreferrer" className="clr-ref-link" data-pubmed aria-label={`Voir sur PubMed : ${e.title} (nouvel onglet)`}>PubMed</a>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
