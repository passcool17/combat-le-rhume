import { useMemo, useState } from "react";
import { usePrefs } from "../lib/stockage.js";
import { doseEnfant, normaliser } from "../lib/outils.js";
import {
  FILTRES,
  GESTES_COMBAT,
  LOGIQUE_COMBAT,
  REMEDES,
  TOUX_CONSEIL,
} from "../data/contenu.js";
import { Card, OnThisPage, Section } from "../components/ui.jsx";
import { Search, Star } from "../components/icones.jsx";
import { cn } from "../lib/cn.js";
import { useNav } from "../lib/nav.js";
import { REF_FOR_REMEDE, REF_GROUP_META } from "../data/refs-meta.js";
import { CombatModeSwitch, CombatPanel, CombatSubtitle, GesteExtra } from "../combat/CombatPlus.jsx";

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
              ? `Renforts, ravitaillement et récupération : plantes, vitamines et le reste. Les cinq gestes du mal de gorge sont dans le mode Combat.`
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
              {audience === `enfant` ? (
                <p className="mt-2 text-sm text-muted">
                  {"Adulte : "}
                  {e.how}
                </p>
              ) : null}
              {e.extra?.map((x) => (
                <p className="mt-2 text-sm text-muted" key={x}>
                  {x}
                </p>
              ))}
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
