import { useJournal, usePrefs } from "../lib/stockage.js";
import { protocoleSelonSymptomes, todayKey } from "../lib/outils.js";
import { useState } from "react";
import {
  A_EVITER,
  A_FAIRE,
  GORGE_GESTES,
  LOGIQUE_COMBAT,
  MODE_SOUTIEN,
  PHASES,
  PILIERS_SOUTIEN,
  PREVENTION,
  PROTOCOLE_DU_JOUR,
  SYMPTOMES_PROTOCOLE,
  SYMPTOMES_TYPIQUES,
} from "../data/contenu.js";
import { Card, Kicker } from "../components/ui.jsx";
import { cn } from "../lib/cn.js";
import { Check } from "../components/icones.jsx";
import { HomeCombat, HomeWarm } from "../combat/CombatPlus.jsx";

export function Accueil({ onRemedies, onAdvice, onPlants, onJournal }) {
  let hydrated = useJournal((e) => e.hydrated),
    o = useJournal((e) => e.entries.find((e) => e.date === todayKey())),
    toggleProtocol = useJournal((e) => e.toggleProtocol),
    c = hydrated ? (o?.protocol.length ?? 0) : 0,
    [l, u] = useState(`aigu`),
    [d, f] = useState([]),
    p = PHASES.find((e) => e.id === l) ?? PHASES[1],
    m = protocoleSelonSymptomes(d),
    h = usePrefs((e) => e.audience) === `enfant`,
    stance = usePrefs((e) => e.stance),
    setStance = usePrefs((e) => e.setStance),
    y = usePrefs((e) => e.hydrated);
  function b(e) {
    f((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e]));
  }
  return (
    <div className="space-y-5">
      <Avertissement />
      <Card>
        <Kicker>Dès le mal de gorge</Kicker>
        <h2 className="mt-1 text-2xl">Choisis ton mode</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={stance === `combat`}
            onClick={() => {
              (setStance(`combat`), onRemedies(`gorge`));
            }}
            className={cn(
              `min-h-12 rounded-2xl px-3 text-sm font-semibold`,
              stance === `combat`
                ? `bg-primary text-primary-fg`
                : `border border-line bg-surface text-ink`,
            )}
          >
            Mode Combat
          </button>
          <button
            type="button"
            aria-pressed={stance === `soutien`}
            onClick={() => setStance(`soutien`)}
            className={cn(
              `min-h-12 rounded-2xl px-3 text-sm font-semibold`,
              stance === `soutien`
                ? `bg-primary text-primary-fg`
                : `border border-primary text-primary`,
            )}
          >
            Mode Soutien
          </button>
        </div>
        {stance === `combat` ? (
          <>
            <p className="mt-4 text-sm text-ink">
              <HomeWarm />
            </p>
            <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-left">
              <p className="text-sm font-medium text-ink">
                Logique des remèdes prioritaires
              </p>
              <ul className="mt-2 space-y-2">
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
                Objectif : supériorité offensive dès les premiers signes de mal
                de gorge.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onRemedies(`gorge`)}
              className="mt-3 text-sm font-medium text-primary"
            >
              Voir les remèdes du mode Combat
            </button>
          </>
        ) : stance === `soutien` ? (
          <p className="mt-4 text-sm text-ink">{MODE_SOUTIEN.detail}</p>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Combat : frapper dès le mal de gorge, et rester très au chaud la
            nuit, tuque comprise, s’il n’y a pas de fièvre, de mal de tête ou de
            frissons. Soutien : vitamine D, zinc, plantes, hydratation.
          </p>
        )}
      </Card>
      {y && stance === `combat` ? (
        <HomeCombat onOpen={() => onRemedies(`gorge`)} onAll={() => onRemedies(`tous`)} />
      ) : y && stance ? (
        <>
          {stance === `soutien` ? (
            <div className="rounded-[var(--radius-card)] border border-primary/30 bg-primary-soft px-4 py-4">
              <p className="font-medium text-primary">{MODE_SOUTIEN.title}</p>
              <p className="mt-1 text-sm text-ink">{MODE_SOUTIEN.detail}</p>
            </div>
          ) : null}
          <Card>
            <Kicker>Repères</Kicker>
            <h2 className="mt-1 text-2xl">Symptômes typiques</h2>
            <ul className="mt-4 space-y-3">
              {SYMPTOMES_TYPIQUES.map((e) => (
                <li className="text-sm text-ink" key={e.lead}>
                  <span className="font-medium">
                    {e.lead}
                    {". "}
                  </span>
                  {e.detail}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <Kicker>Selon les symptômes</Kicker>
            <h2 className="mt-1 text-2xl">Protocole recommandé</h2>
            {h ? (
              <p className="mt-2 text-sm text-caution">
                Mode enfant : les fiches montrent une dose réduite. Ne pas
                reprendre les doses adultes.
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              {SYMPTOMES_PROTOCOLE.map((e) => {
                let t = d.includes(e.id);
                return (
                  <button
                    type="button"
                    aria-pressed={t}
                    onClick={() => b(e.id)}
                    className={cn(
                      `min-h-11 rounded-full px-4 text-sm font-medium`,
                      t
                        ? `bg-primary text-primary-fg`
                        : `border border-line bg-surface text-ink`,
                    )}
                    key={e.id}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
            {m.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Cochez des symptômes pour générer un protocole.
              </p>
            ) : (
              <ul className="mt-4 space-y-2">
                {m.map((e) => (
                  <li className="flex gap-2 text-sm text-ink" key={e}>
                    <span
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            )}
            <button
              type="button"
              onClick={() => {
                onRemedies(d.find((e) => e !== `fatigue`) ?? `tous`);
              }}
              className="mt-4 text-sm font-medium text-primary"
            >
              Voir les remèdes correspondants
            </button>
          </Card>
          <Card>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <Kicker>Aujourd’hui</Kicker>
                <h2 className="mt-1 text-2xl text-ink">Protocole du jour</h2>
              </div>
              <p className="font-display text-2xl text-primary tabular-nums">
                {c}
                <span className="text-base text-muted">
                  /{PROTOCOLE_DU_JOUR.length}
                </span>
              </p>
            </div>
            <div
              className="mb-5 h-1.5 overflow-hidden rounded-full bg-primary-soft"
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-200"
                style={{
                  width: `${(c / PROTOCOLE_DU_JOUR.length) * 100}%`,
                }}
              />
            </div>
            <ol className="space-y-2">
              {PROTOCOLE_DU_JOUR.map((e, t) => {
                let n = hydrated && (o?.protocol.includes(e.id) ?? false);
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => toggleProtocol(e.id)}
                      aria-pressed={n}
                      className="flex w-full items-start gap-3 rounded-2xl px-1 py-2 text-left hover:bg-surface-2"
                    >
                      <span
                        className={cn(
                          `mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums`,
                          n
                            ? `border-primary bg-primary text-primary-fg`
                            : `border-line bg-surface text-muted`,
                        )}
                      >
                        {n ? (
                          <Check className="size-3.5" strokeWidth={2.5} />
                        ) : (
                          t + 1
                        )}
                      </span>
                      <span>
                        <span
                          className={cn(
                            `block font-medium`,
                            n && `text-muted line-through`,
                          )}
                        >
                          {e.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted">
                          {e.detail}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Card>
          <Card>
            <Kicker>Priorité</Kicker>
            <h2 className="mt-1 text-2xl">Vitamine D et soleil</h2>
            <p className="mt-3 text-sm text-ink">
              La plupart des gens ont besoin d’un supplément, surtout au Québec
              en automne et en hiver. Elle compte pour le système immunitaire.
            </p>
            <p className="mt-2 text-sm text-muted">
              {h
                ? `Chez l’enfant, la dose dépend de l’âge. Ne pas reprendre 2 000 à 4 000 UI sans avis.`
                : `Dose courante chez l’adulte : 2 000 à 4 000 UI par jour, à adapter selon une prise de sang.`}
            </p>
            <p className="mt-3 text-sm text-ink">
              Soleil : visage et bras, sans lunettes de soleil, sans brûler. Au
              moins 30 minutes, une heure c’est mieux, surtout en été. Les
              lunettes réduisent l’apport en UV.
            </p>
          </Card>
          <Card>
            <Kicker>Repères</Kicker>
            <h2 className="mt-1 text-2xl">Quoi faire, quoi éviter</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-primary">À faire</p>
                <ul className="mt-2 space-y-2">
                  {A_FAIRE.map((e) => (
                    <li className="flex gap-2 text-sm text-ink" key={e}>
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                        aria-hidden="true"
                      />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-medium text-caution">À éviter</p>
                <ul className="mt-2 space-y-2">
                  {A_EVITER.map((e) => (
                    <li className="flex gap-2 text-sm text-ink" key={e}>
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-caution"
                        aria-hidden="true"
                      />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
          <Card>
            <Kicker>Mal de gorge</Kicker>
            <h2 className="mt-1 text-2xl">Frapper fort dès le début</h2>
            <ul className="mt-4 space-y-3">
              {GORGE_GESTES.map((e) => (
                <li className="text-sm text-ink" key={e.lead}>
                  <span className="font-medium">
                    {e.lead}
                    {". "}
                  </span>
                  {e.detail}
                </li>
              ))}
            </ul>
            {h ? (
              <p className="mt-3 text-sm text-caution">
                Chez l’enfant : pas de peroxyde, et pas de miel avant 1 an. Le
                spray Betadine, pas avant 6 ans.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => onRemedies(`gorge`)}
              className="mt-4 text-sm font-medium text-primary"
            >
              Voir les remèdes pour la gorge
            </button>
          </Card>
          <Card>
            <Kicker>Repère</Kicker>
            <h2 className="mt-1 mb-4 text-2xl">Où en êtes-vous ?</h2>
            <div className="grid grid-cols-3 gap-2">
              {PHASES.map((e) => {
                let t = e.id === l;
                return (
                  <button
                    type="button"
                    aria-pressed={t}
                    onClick={() => u(e.id)}
                    className={cn(
                      `min-h-11 rounded-2xl px-2 py-2.5 text-sm leading-tight font-medium`,
                      t
                        ? `bg-primary text-primary-fg`
                        : `border border-line bg-surface-2 text-ink`,
                    )}
                    key={e.id}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
            <ul className="mt-4 space-y-2">
              {p.lines.map((e) => (
                <li className="flex gap-2 text-sm text-ink" key={e}>
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onRemedies(p.filter)}
              className="mt-4 text-sm font-medium text-primary"
            >
              Voir les remèdes correspondants
            </button>
          </Card>
          {stance === `soutien` ? (
            <div className="grid gap-3 sm:grid-cols-3">
              {PILIERS_SOUTIEN.map((e) => (
                <Card className="p-4" key={e.title}>
                  <h3 className="text-lg">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted">{e.detail}</p>
                </Card>
              ))}
            </div>
          ) : null}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onPlants}
              className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-4 text-left"
            >
              <span className="block font-medium">Plantes pour la toux</span>
              <span className="mt-1 block text-sm text-muted">
                Thym, miel, pin, réglisse.
              </span>
            </button>
            <button
              type="button"
              onClick={onJournal}
              className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-4 text-left"
            >
              <span className="block font-medium">Journal</span>
              <span className="mt-1 block text-sm text-muted">
                Intensité et notes, sur cet appareil.
              </span>
            </button>
          </div>
          <Card>
            <Kicker>Avant d’être malade</Kicker>
            <h2 className="mt-1 text-2xl">Prévention</h2>
            <ul className="mt-4 space-y-2">
              {PREVENTION.map((e) => (
                <li className="flex gap-2 text-sm text-ink" key={e}>
                  <span
                    className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                    aria-hidden="true"
                  />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Card>
          <button
            type="button"
            onClick={onAdvice}
            className="flex w-full items-center justify-between rounded-[var(--radius-card)] border border-caution/40 bg-caution-soft px-5 py-4 text-left"
          >
            <span>
              <span className="block font-medium text-caution">
                Quand consulter
              </span>
              <span className="mt-0.5 block text-sm text-ink">
                Fièvre haute, souffle court, aggravation après une amélioration.
              </span>
            </span>
            <span className="text-sm font-medium text-caution">Ouvrir</span>
          </button>
        </>
      ) : null}
    </div>
  );
}

export function Avertissement() {
  let [e, t] = useState(false);
  return (
    <div className="rounded-[var(--radius-card)] border border-caution/30 bg-caution-soft px-4 py-3 text-sm text-ink">
      <p>
        <span className="font-medium text-caution">{"Avertissement. "}</span>Ces
        informations sont éducatives et ne remplacent pas un avis médical.
      </p>
      {e ? (
        <p className="mt-2 text-muted">
          Consultez si les symptômes persistent, s’aggravent, ou en cas de
          fièvre élevée — surtout chez les enfants, les personnes âgées ou les
          personnes fragiles. L’argent colloïdal et le peroxyde d’hydrogène
          demandent une utilisation très prudente, selon le fabricant.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => t((e) => !e)}
        className="mt-2 font-medium text-caution"
      >
        {e ? `Réduire` : `Lire la suite`}
      </button>
    </div>
  );
}
