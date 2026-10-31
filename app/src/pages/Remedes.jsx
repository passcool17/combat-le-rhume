import { useMemo, useState } from "react";
import { usePrefs } from "../lib/stockage.js";
import { doseEnfant, normaliser } from "../lib/outils.js";
import {
  FILTRES,
  GESTES_COMBAT,
  LOGIQUE_COMBAT,
  REMEDES,
  TOUX_CONSEIL,
  ASPIRINE_ENFANT,
  MEDICAMENTS_INFO,
  MEDICAMENTS_INFO_INTRO,
} from "../data/contenu.js";
import { Card, OnThisPage, Section } from "../components/ui.jsx";
import { Search, Star } from "../components/icones.jsx";
import { cn } from "../lib/cn.js";
import { useNav } from "../lib/nav.js";
import { REF_FOR_REMEDE, REF_GROUP_META } from "../data/refs-meta.js";
import { CombatModeSwitch, CombatPanel, CombatSubtitle, GesteExtra, SecuriteBox, ZincAvertissement } from "../combat/CombatPlus.jsx";

export function Remedes({ filter, onFilter }) {
  let [n, r] = useState(``),
    [i, a] = useState(false),
    audience = usePrefs((e) => e.audience),
    stance = usePrefs((e) => e.stance),
    favorites = usePrefs((e) => e.favorites),
    toggleFavorite = usePrefs((e) => e.toggleFavorite),
    d = useMemo(() => {
      let t = normaliser(n.trim()),
        r = stance === `combat`,
        a = REMEDES.filter((n) => {
          let a = GESTES_COMBAT.includes(n.id);
          return (r && !a) ||
            (r && audience === `enfant` && n.id === `peroxyde`) ||
            (audience === `enfant` && (n.id === `argent` || n.id === `quercetine` || n.id === `girofle` || n.id === `nac` || n.id === `astragale` || n.id === `vitamines-b` || n.id === `nmn` || n.id === `creatine` || n.id === `aspirine`)) ||
            (stance === `soutien` && a) ||
            (i && !favorites.includes(n.id)) ||
            (!r && filter === `prudence` && !n.caution) ||
            (!r &&
              filter !== `tous` &&
              filter !== `prudence` &&
              !n.topics.includes(filter))
            ? false
            : !t ||
                normaliser(
                  `${n.name} ${n.kicker} ${n.how} ${doseEnfant(n.id)} ${n.tag} ${n.topics.join(` `)} ${n.extra?.join(` `) ?? ``}`,
                ).includes(t);
        });
      return r
        ? a.sort(
            (e, t) => GESTES_COMBAT.indexOf(e.id) - GESTES_COMBAT.indexOf(t.id),
          )
        : a.sort(
            (e, t) =>
              Number(favorites.includes(t.id)) -
              Number(favorites.includes(e.id)),
          );
    }, [favorites, i, filter, n, stance, audience]);
  return (
    <div className="space-y-5">
      <div className={cn(stance === `combat` ? `clr-hero-combat` : stance === `soutien` ? `clr-hero-soutien rounded-[var(--radius-card)] px-4 py-4` : ``)} data-clr={stance === `combat` ? `hero-combat` : stance === `soutien` ? `hero-soutien` : undefined}>
        {stance === `combat` ? (
          <p className="clr-hero-k"><span aria-hidden="true">⚔️ </span>On part à la guerre contre la zone infectée</p>
        ) : stance === `soutien` ? (
          <p className="text-xs font-medium tracking-widest text-primary uppercase">L’équipe de soutien de ton système immunitaire</p>
        ) : null}
        <h1 className={stance === `combat` ? `clr-hero-t` : `text-2xl`}>
          {stance === `combat`
            ? `Mode Combat`
            : stance === `soutien`
              ? `Mode Soutien`
              : `Remèdes`}
        </h1>
        <p className={stance === `combat` ? `clr-hero-s` : `mt-1 text-sm text-muted`}>
          {stance === `combat`
            ? <CombatSubtitle />
            : stance === `soutien`
              ? `Renforts, ravitaillement et récupération contre le rhume et la grippe : plantes, vitamines et le reste. Les cinq gestes du mal de gorge sont dans le mode Combat.`
              : audience === `enfant`
                ? `Doses réduites. Ce n’est pas une ordonnance : en cas de doute, demander un avis.`
                : `Doses, durée et précautions. Les fiches ambre demandent plus de retenue.`}
        </p>
      </div>
      {stance === `combat` ? (
        <Card className="p-4">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase"><span aria-hidden="true">🎯 </span>Ordres de mission</p>
          <p className="mt-1 text-sm font-medium">
            Logique des remèdes prioritaires
          </p>
          <ul className="mt-3 space-y-2">
            {LOGIQUE_COMBAT.map((e) => (
              <li className="text-sm text-ink" key={e.lead}>
                <span className="font-medium">
                  {e.lead}
                  {". "}
                </span>
                {e.detail}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">
            Objectif : frapper tôt et sans relâche, dès les premiers signes de mal de gorge.
          </p>
        </Card>
      ) : null}
      {stance === `combat` ? <CombatPanel audience={audience} /> : null}
      {stance !== `combat` && (
      <label className="flex h-12 items-center gap-2 rounded-full border border-line bg-surface px-4">
        <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
        <span className="sr-only">Rechercher un remède</span>
        <input
          value={n}
          onChange={(e) => r(e.target.value)}
          placeholder="Rechercher un remède ou un symptôme…"
          className="w-full bg-transparent text-base text-ink outline-none placeholder:text-muted"
        />
      </label>
      )}
      <div
        className={cn(
          `flex gap-2 overflow-x-auto pb-1`,
          stance === `combat` && `hidden`,
        )}
      >
        <button
          type="button"
          aria-pressed={i}
          onClick={() => a((e) => !e)}
          className={cn(
            `inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-medium`,
            i
              ? `bg-primary text-primary-fg`
              : `border border-line bg-surface text-ink`,
          )}
        >
          <Star
            className={cn(`size-3.5`, i && `fill-current`)}
            aria-hidden="true"
          />
          Favoris
        </button>
        {FILTRES.map((n) => {
          let r = n.id === filter;
          return (
            <button
              type="button"
              aria-pressed={r}
              onClick={() => onFilter(n.id)}
              className={cn(
                `h-11 shrink-0 rounded-full px-4 text-sm font-medium`,
                r
                  ? `bg-primary text-primary-fg`
                  : `border border-line bg-surface text-ink`,
              )}
              key={n.id}
            >
              {n.label}
            </button>
          );
        })}
      </div>
      {stance !== `combat` && d.length > 1 ? (
        <OnThisPage items={d.map((e) => ({ id: `remede-${e.id}`, label: e.name }))} />
      ) : null}
      {d.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">
            {i
              ? `Aucun favori pour ce filtre. Touche l’étoile sur une fiche.`
              : `Aucun remède pour cette recherche.`}
          </p>
        </Card>
      ) : (
        <div
          className={cn(
            `grid items-start gap-3`,
            stance === `combat` ? `mx-auto max-w-lg` : `md:grid-cols-2`,
          )}
        >
          {d.map((e) => (
            <Section
              id={`remede-${e.id}`}
              key={e.id}
              caution={e.caution}
              kicker={e.kicker}
              kickerClassName={cn(`tracking-wide`, e.caution ? `text-caution` : `text-primary`)}
              title={e.name}
              titleClassName="text-xl"
              defaultOpen={stance === `combat`}
              forceOpen={!!n.trim()}
              aside={
                <button
                  type="button"
                  aria-pressed={favorites.includes(e.id)}
                  aria-label={favorites.includes(e.id) ? `Retirer ${e.name} des favoris` : `Ajouter ${e.name} aux favoris`}
                  onClick={() => toggleFavorite(e.id)}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line"
                >
                  <Star className={cn(`size-5`, favorites.includes(e.id) ? `fill-current text-caution` : `text-muted`)} aria-hidden="true" />
                </button>
              }
            >
              <p className="text-sm">{audience === `enfant` ? doseEnfant(e.id) : e.how}</p>
              {audience === `enfant` && !e.adulteSeulement ? (
                <p className="mt-2 text-sm text-muted">
                  {"Adulte : "}
                  {e.how}
                </p>
              ) : null}
              {e.avertissement && audience !== `enfant` ? <ZincAvertissement /> : null}
              {(audience === `enfant` && e.extraEnfant ? e.extraEnfant : e.extra)?.map((x) => (
                <p className="mt-2 text-sm text-muted" key={x}>
                  {x}
                </p>
              ))}
              {e.securite && (audience !== `enfant` || !(e.adulteSeulement || e.securiteAdulte)) ? <SecuriteBox id={e.id} items={e.securite} titre={e.securiteTitre} /> : null}
              {e.href ? (
                <a href={e.href} target="_blank" rel="noreferrer" className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary">
                  Voir sur Amazon
                </a>
              ) : null}
              <p className={cn(`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium`, e.caution ? `bg-caution-soft text-caution` : `bg-primary-soft text-primary`)}>{e.tag}</p>
              {REF_FOR_REMEDE[e.id] ? (
                <p>
                  <button type="button" className="clr-ref-cta mt-1" data-ref-link={REF_FOR_REMEDE[e.id]} onClick={() => useNav.getState().openReferences(REF_FOR_REMEDE[e.id])}>
                    Références : {REF_GROUP_META.find((g) => g.id === REF_FOR_REMEDE[e.id]).title} ({REF_GROUP_META.find((g) => g.id === REF_FOR_REMEDE[e.id]).count})
                  </button>
                </p>
              ) : null}
              {stance === `combat` ? <GesteExtra id={e.id} audience={audience} /> : null}
            </Section>
          ))}
        </div>
      )}
      {stance !== `combat` && audience === `enfant` && !i && (filter === `tous` || filter === `fievre` || filter === `gorge` || filter === `prudence`) ? (
        <Card caution data-clr="aspirine-enfant">
          <p className="text-xs font-medium tracking-widest text-caution uppercase">Important · enfant et ado</p>
          <h2 className="mt-1 text-lg">Pas d’aspirine</h2>
          <p className="mt-2 text-sm">{ASPIRINE_ENFANT}</p>
        </Card>
      ) : null}
      {stance !== `combat` && audience !== `enfant` && !i && filter === `tous` ? <MedicamentsInfo query={n} /> : null}
      {stance === `combat` ? <CombatModeSwitch onAll={() => onFilter(`tous`)} /> : null}
      {filter === `toux` && stance !== `combat` ? (
        <Card>
          <h2 className="text-lg">Si la toux s’installe</h2>
          <p className="mt-2 text-sm text-muted">{TOUX_CONSEIL}</p>
        </Card>
      ) : null}
    </div>
  );
}

// ---------- Médicaments dont on parle — sur ordonnance : fiches d’information seulement (pas de dose, pas de kit, pas de prévention ; cachées en Enfant et en Combat) ----------
function MedicamentsInfo({ query }) {
  let t = normaliser(query.trim()),
    items = MEDICAMENTS_INFO.filter((e) => !t || normaliser(`${e.name} ${e.kicker} ${e.quoi} ${e.statut}`).includes(t));
  if (!items.length) return null;
  return (
    <section className="space-y-3" data-clr="medicaments-info" aria-labelledby="medicaments-info-titre">
      <div>
        <p className="text-xs font-medium tracking-widest text-caution uppercase">Information · pas un remède</p>
        <h2 id="medicaments-info-titre" className="mt-1 text-xl">Médicaments dont on parle — sur ordonnance</h2>
        <p className="mt-1 text-sm text-muted">{MEDICAMENTS_INFO_INTRO}</p>
      </div>
      <div className="grid items-start gap-3 md:grid-cols-2">
        {items.map((e) => {
          let g = e.ref ? REF_GROUP_META.find((x) => x.id === e.ref) : null;
          return (
            <Section id={`info-${e.id}`} key={e.id} caution kicker={e.kicker} kickerClassName="tracking-wide text-caution" title={e.name} titleClassName="text-xl" forceOpen={!!query.trim()}>
              <p className="text-sm">{e.quoi}</p>
              <p className="mt-2 text-sm" data-clr={`${e.id}-statut`}><span className="font-medium">Statut : </span>{e.statut.replace(/^Au Canada : /, `Au Canada, `)}</p>
              <p className="mt-3 text-xs font-medium tracking-wide text-primary uppercase">Ce qu’avancent ses défenseurs</p>
              <ul className="mt-1 list-disc space-y-1 pl-5">
                {e.arguments.map((x) => <li className="text-sm text-muted" key={x}>{x}</li>)}
              </ul>
              <p className="mt-3 rounded-lg bg-caution-soft px-3 py-2 text-sm font-medium text-caution" data-clr={`${e.id}-dose`}>{e.dose}</p>
              <p className="mt-2 text-sm text-muted" data-clr={`${e.id}-essais`}><span className="font-medium text-ink">Les grands essais : </span>{e.essais}</p>
              <SecuriteBox id={e.id} items={e.securite} />
              <p className="mt-3 text-sm font-semibold">Sources</p>
              <ul data-clr={`${e.id}-sources`}>
                {e.sources.map((x) => (
                  <li key={x.url}><a className="clr-ref-a flex min-h-11 items-center py-1 text-sm" href={x.url} target="_blank" rel="noopener noreferrer" aria-label={`${x.label} (nouvel onglet)`}>{x.label}</a></li>
                ))}
              </ul>
              {g ? (
                <p>
                  <button type="button" className="clr-ref-cta mt-1" data-ref-link={g.id} onClick={() => useNav.getState().openReferences(g.id)}>
                    Références : {g.title} ({g.count})
                  </button>
                </p>
              ) : (
                <p className="mt-2 text-xs text-muted">Pas de thème Références : aucune étude chez l’humain ne l’appuie contre le rhume ou la grippe.</p>
              )}
            </Section>
          );
        })}
      </div>
    </section>
  );
}
