import { useJournal, usePrefs } from "../lib/stockage.js";
import { useNav } from "../lib/nav.js";
import { protocoleSelonSymptomes, todayKey } from "../lib/outils.js";
import { useEffect, useRef, useState } from "react";
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
import { Button, Card, Kicker, OnThisPage, Section } from "../components/ui.jsx";
import { cn } from "../lib/cn.js";
import { Check } from "../components/icones.jsx";
import { HomeCombat, HomeWarm } from "../combat/CombatPlus.jsx";

const BTN_LINK = `mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary`;

function Puce({ tone = `primary` }) {
  return <span className={cn(`mt-2 size-1.5 shrink-0 rounded-full`, tone === `caution` ? `bg-caution` : `bg-primary`)} aria-hidden="true" />;
}

/** Accueil sans mode : explication en 3 lignes, les deux modes, bouton « Commencer ». */
export function Onboarding({ onStart }) {
  return (
    <Card className="p-6" data-onboarding>
      <Kicker>Bienvenue</Kicker>
      <h1 className="mt-1 text-3xl">Combat le rhume, en bref</h1>
      <ul className="mt-4 space-y-2">
        {[
          `Un guide éducatif pour traverser un rhume ou une grippe, du premier mal de gorge à la convalescence.`,
          `Tu choisis un mode : l’appli n’affiche alors que les remèdes et les conseils utiles à ce moment-là.`,
          `Ton suivi reste sur cet appareil. Ce guide ne remplace pas un avis médical.`,
        ].map((t) => (
          <li className="flex gap-2 text-sm text-ink" key={t}>
            <Puce />
            <span>{t}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="clr-card-combat rounded-2xl px-4 py-4" data-mode-card="combat">
          <p className="clr-card-k"><span aria-hidden="true">⚔️ </span>On part à la guerre contre la zone infectée</p>
          <p className="clr-card-t">Mode Combat</p>
          <p className="mt-1 text-sm">Dès le premier mal de gorge : cinq gestes, un point matin et soir, pendant 3 jours.</p>
        </div>
        <div className="clr-card-soutien rounded-2xl px-4 py-3" data-mode-card="soutien">
          <p className="clr-card-k">L’équipe de soutien de ton système immunitaire</p>
          <p className="clr-card-t">Mode Soutien</p>
          <p className="mt-1 text-sm text-ink">Pour la suite : vitamine D, zinc, plantes, hydratation et repos.</p>
        </div>
      </div>
      <Button className="mt-5 h-12 w-full text-base" onClick={onStart}>
        Commencer
      </Button>
    </Card>
  );
}

export function Accueil() {
  const today = useJournal((e) => e.entries.find((x) => x.date === todayKey()));
  const toggleProtocol = useJournal((e) => e.toggleProtocol);
  const done = today?.protocol.length ?? 0;
  const [phaseId, setPhaseId] = useState(`aigu`);
  const [picked, setPicked] = useState([]);
  const phase = PHASES.find((e) => e.id === phaseId) ?? PHASES[1];
  const protocole = protocoleSelonSymptomes(picked);
  const enfant = usePrefs((e) => e.audience) === `enfant`;
  const stance = usePrefs((e) => e.stance);
  const setStance = usePrefs((e) => e.setStance);
  const onboarded = usePrefs((e) => e.onboarded);
  const setOnboarded = usePrefs((e) => e.setOnboarded);
  const { openRemedies, setTab } = useNav.getState();
  const chooserRef = useRef(null);
  const [justStarted, setJustStarted] = useState(false);
  useEffect(() => {
    if (justStarted) chooserRef.current?.focus();
  }, [justStarted]);
  function togglePick(id) {
    setPicked((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }
  if (!stance && !onboarded) {
    return (
      <div className="space-y-5">
        <Avertissement />
        <Onboarding
          onStart={() => {
            setOnboarded(true);
            setJustStarted(true);
          }}
        />
      </div>
    );
  }
  const sections = [
    { id: `symptomes-typiques`, label: `Symptômes typiques` },
    { id: `protocole-recommande`, label: `Protocole recommandé` },
    { id: `protocole-du-jour`, label: `Protocole du jour` },
    { id: `vitamine-d`, label: `Vitamine D et soleil` },
    { id: `quoi-faire`, label: `Quoi faire, quoi éviter` },
    { id: `mal-de-gorge`, label: `Frapper fort dès le début` },
    { id: `ou-en-es-tu`, label: `Où en es-tu ?` },
    ...(stance === `soutien` ? [{ id: `piliers`, label: `Les trois piliers` }] : []),
    { id: `prevention`, label: `Prévention` },
  ];
  return (
    <div className="space-y-5">
      <Avertissement />
      <Card>
        <Kicker>Dès le mal de gorge</Kicker>
        <h1 ref={chooserRef} tabIndex={-1} className="mt-1 text-2xl outline-none">
          Choisis ton mode
        </h1>
        <div className="mt-4 grid grid-cols-2 gap-2" data-clr="choix-mode">
          <div className={cn(`clr-choice clr-choice-combat`, stance === `combat` && `on`)}>
            <button
              type="button"
              aria-pressed={stance === `combat`}
              aria-describedby="choix-combat-d"
              onClick={() => {
                setStance(`combat`);
                openRemedies(`gorge`);
              }}
              className="clr-choice-btn"
            >
              <span aria-hidden="true">⚔️ </span>Mode Combat
            </button>
            <p id="choix-combat-d" className={cn(`clr-choice-d`, stance === `soutien` && `sr-only`)}>On part à la guerre contre la zone infectée.</p>
          </div>
          <div className={cn(`clr-choice clr-choice-soutien`, stance === `soutien` && `on`)}>
            <button
              type="button"
              aria-pressed={stance === `soutien`}
              aria-describedby="choix-soutien-d"
              onClick={() => setStance(`soutien`)}
              className="clr-choice-btn"
            >
              Mode Soutien
            </button>
            <p id="choix-soutien-d" className={cn(`clr-choice-d`, stance === `soutien` && `sr-only`)}>L’équipe de soutien de ton système immunitaire.</p>
          </div>
        </div>
        {stance === `combat` ? (
          <>
            <p className="mt-4 text-sm text-ink">
              <HomeWarm />
            </p>
            <div className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-left">
              <p className="text-xs font-semibold tracking-widest text-primary uppercase"><span aria-hidden="true">🎯 </span>Ordres de mission</p>
              <p className="mt-1 text-sm font-medium text-ink">Logique des remèdes prioritaires</p>
              <ul className="mt-2 space-y-2">
                {LOGIQUE_COMBAT.map((e) => (
                  <li className="text-sm text-ink" key={e.lead}>
                    <span className="font-medium">{e.lead}. </span>
                    {e.detail}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted">Objectif : frapper tôt et sans relâche, dès les premiers signes de mal de gorge.</p>
            </div>
            <button type="button" onClick={() => openRemedies(`gorge`)} className={BTN_LINK}>
              Voir les remèdes du mode Combat
            </button>
          </>
        ) : stance === `soutien` ? null : (
          <p className="mt-4 text-sm text-muted">
            Combat : frapper dès le mal de gorge, et rester très au chaud la nuit, tuque comprise, s’il n’y a pas de fièvre, de mal de tête ou de frissons. Soutien : vitamine D, zinc, plantes, hydratation.
          </p>
        )}
      </Card>
      {stance === `combat` ? (
        <HomeCombat onOpen={() => openRemedies(`gorge`)} onAll={() => openRemedies(`tous`)} />
      ) : stance ? (
        <>
          {stance === `soutien` ? (
            <div className="clr-hero-soutien rounded-[var(--radius-card)] px-4 py-4" data-clr="soutien-equipe">
              <p className="font-medium text-primary">{MODE_SOUTIEN.title}</p>
              <p className="mt-1 text-sm text-ink">{MODE_SOUTIEN.detail}</p>
            </div>
          ) : null}
          <OnThisPage items={sections} />
          <Section id="symptomes-typiques" kicker="Repères" title="Symptômes typiques">
            <ul className="space-y-3">
              {SYMPTOMES_TYPIQUES.map((e) => (
                <li className="text-sm text-ink" key={e.lead}>
                  <span className="font-medium">{e.lead}. </span>
                  {e.detail}
                </li>
              ))}
            </ul>
          </Section>
          <Section id="protocole-recommande" kicker="Selon les symptômes" title="Protocole recommandé">
            {enfant ? <p className="text-sm text-caution">Mode enfant : les fiches montrent une dose réduite. Ne pas reprendre les doses adultes.</p> : null}
            <div className="mt-2 flex flex-wrap gap-2">
              {SYMPTOMES_PROTOCOLE.map((e) => {
                const on = picked.includes(e.id);
                return (
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => togglePick(e.id)}
                    className={cn(`min-h-11 rounded-full px-4 text-sm font-medium`, on ? `bg-primary text-primary-fg` : `border border-line bg-surface text-ink`)}
                    key={e.id}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
            {protocole.length === 0 ? (
              <p className="mt-4 text-sm text-muted">Coche des symptômes pour voir un protocole.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {protocole.map((e) => (
                  <li className="flex gap-2 text-sm text-ink" key={e}>
                    <Puce />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" onClick={() => openRemedies(picked.find((e) => e !== `fatigue`) ?? `tous`)} className={BTN_LINK}>
              Voir les remèdes correspondants
            </button>
          </Section>
          <Section
            id="protocole-du-jour"
            kicker="Aujourd’hui"
            title="Protocole du jour"
            aside={
              <p className="pt-3 font-display text-2xl text-primary tabular-nums" aria-label={`${done} sur ${PROTOCOLE_DU_JOUR.length} faits`}>
                {done}
                <span className="text-base text-muted">/{PROTOCOLE_DU_JOUR.length}</span>
              </p>
            }
          >
            <div className="mb-5 h-1.5 overflow-hidden rounded-full bg-primary-soft" aria-hidden="true">
              <div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${(done / PROTOCOLE_DU_JOUR.length) * 100}%` }} />
            </div>
            <ol className="space-y-2">
              {PROTOCOLE_DU_JOUR.map((e, i) => {
                const on = today?.protocol.includes(e.id) ?? false;
                return (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => toggleProtocol(e.id)}
                      aria-pressed={on}
                      className="flex min-h-11 w-full items-start gap-3 rounded-2xl px-1 py-2 text-left hover:bg-surface-2"
                    >
                      <span
                        className={cn(
                          `mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums`,
                          on ? `border-primary bg-primary text-primary-fg` : `border-line bg-surface text-muted`,
                        )}
                      >
                        {on ? <Check className="size-3.5" strokeWidth={2.5} /> : i + 1}
                      </span>
                      <span>
                        <span className={cn(`block font-medium`, on && `text-muted line-through`)}>{e.title}</span>
                        <span className="mt-0.5 block text-sm text-muted">{e.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </Section>
          <Section id="vitamine-d" kicker="Priorité" title="Vitamine D et soleil">
            <p className="text-sm text-ink">Un supplément est souvent recommandé au Québec en automne et en hiver : demande conseil à ton pharmacien ou à ton médecin. Elle compte pour le système immunitaire.</p>
            <p className="mt-2 text-sm text-muted">
              {enfant
                ? `Chez l’enfant, la dose dépend de l’âge. Ne pas reprendre 2 000 à 4 000 UI sans avis.`
                : `Dose courante chez l’adulte : 2 000 à 4 000 UI par jour, à adapter selon une prise de sang.`}
            </p>
            <p className="mt-3 text-sm text-ink">
              Soleil : visage et bras, sans lunettes de soleil, sans brûler. Au moins 30 minutes, une heure c’est mieux, surtout en été. Les lunettes réduisent l’apport en UV.
            </p>
          </Section>
          <Section id="quoi-faire" kicker="Repères" title="Quoi faire, quoi éviter">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-primary">À faire</p>
                <ul className="mt-2 space-y-2">
                  {A_FAIRE.map((e) => (
                    <li className="flex gap-2 text-sm text-ink" key={e}>
                      <Puce />
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
                      <Puce tone="caution" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>
          <Section id="mal-de-gorge" kicker="Mal de gorge" title="Frapper fort dès le début">
            <ul className="space-y-3">
              {GORGE_GESTES.map((e) => (
                <li className="text-sm text-ink" key={e.lead}>
                  <span className="font-medium">{e.lead}. </span>
                  {e.detail}
                </li>
              ))}
            </ul>
            {enfant ? <p className="mt-3 text-sm text-caution">Chez l’enfant : pas de peroxyde, et pas de miel avant 1 an. Le spray Betadine, pas avant 6 ans.</p> : null}
            <button type="button" onClick={() => openRemedies(`gorge`)} className={BTN_LINK}>
              Voir les remèdes pour la gorge
            </button>
          </Section>
          <Section id="ou-en-es-tu" kicker="Repère" title="Où en es-tu ?">
            <div className="grid grid-cols-3 gap-2">
              {PHASES.map((e) => {
                const on = e.id === phaseId;
                return (
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => setPhaseId(e.id)}
                    className={cn(`min-h-11 rounded-2xl px-2 py-2.5 text-sm leading-tight font-medium`, on ? `bg-primary text-primary-fg` : `border border-line bg-surface-2 text-ink`)}
                    key={e.id}
                  >
                    {e.label}
                  </button>
                );
              })}
            </div>
            <ul className="mt-4 space-y-2">
              {phase.lines.map((e) => (
                <li className="flex gap-2 text-sm text-ink" key={e}>
                  <Puce />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
            <button type="button" onClick={() => openRemedies(phase.filter)} className={BTN_LINK}>
              Voir les remèdes correspondants
            </button>
          </Section>
          {stance === `soutien` ? (
            <Section id="piliers" kicker="L’équipe de soutien" title="Les trois piliers">
              <div className="grid gap-3 sm:grid-cols-3">
                {PILIERS_SOUTIEN.map((e) => (
                  <div className="rounded-2xl border border-line bg-surface-2 p-4" key={e.title}>
                    <h3 className="text-lg">{e.title}</h3>
                    <p className="mt-1 text-sm text-muted">{e.detail}</p>
                  </div>
                ))}
              </div>
            </Section>
          ) : null}
          <Section id="prevention" kicker="Avant d’être malade" title="Prévention">
            <ul className="space-y-2">
              {PREVENTION.map((e) => (
                <li className="flex gap-2 text-sm text-ink" key={e}>
                  <Puce />
                  <span>{e}</span>
                </li>
              ))}
            </ul>
          </Section>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => setTab(`plantes`)} className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-4 text-left">
              <span className="block font-medium">Plantes pour la toux</span>
              <span className="mt-1 block text-sm text-muted">Thym, miel, pin, réglisse.</span>
            </button>
            <button type="button" onClick={() => setTab(`suivi`)} className="rounded-[var(--radius-card)] border border-line bg-surface px-4 py-4 text-left">
              <span className="block font-medium">Suivi</span>
              <span className="mt-1 block text-sm text-muted">Journal et point matin et soir, sur cet appareil.</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setTab(`conseils`)}
            className="flex w-full items-center justify-between rounded-[var(--radius-card)] border border-caution/40 bg-caution-soft px-5 py-4 text-left"
          >
            <span>
              <span className="block font-medium text-caution">Quand consulter</span>
              <span className="mt-0.5 block text-sm text-ink">Fièvre haute, souffle court, aggravation après une amélioration.</span>
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
          Consulte si les symptômes persistent, s’aggravent, ou en cas de fièvre élevée — surtout chez les enfants, les personnes âgées ou les personnes fragiles. L’argent colloïdal n’est pas recommandé par voie interne (mise en garde de Santé Canada). Le peroxyde d’hydrogène demande une utilisation très prudente : jamais avalé, pas dans le nez.
        </p>
      ) : null}
      <button
        type="button"
        onClick={() => t((e) => !e)}
        aria-expanded={e}
        className="mt-1 inline-flex min-h-11 items-center font-medium text-caution"
      >
        {e ? `Réduire` : `Lire la suite`}
      </button>
    </div>
  );
}
