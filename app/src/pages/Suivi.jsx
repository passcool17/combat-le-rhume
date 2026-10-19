// Onglet Suivi : journal du jour + point matin et soir (Mode Combat) + mes données.
import { useEffect, useRef, useState } from "react";
import { useSuivi, toCSV, toJSON, download, validate, dayKey } from "../lib/suivi.js";
import { usePrefs } from "../lib/stockage.js";
import { useNav } from "../lib/nav.js";
import { formatJour, lastDays } from "../lib/outils.js";
import { Button, Card, Kicker } from "../components/ui.jsx";
import { SYMPTOMES } from "../data/contenu.js";
import { cn } from "../lib/cn.js";
import { Trash2 } from "../components/icones.jsx";
import { CombatCheck, CombatConsult, assessCombat } from "../combat/CombatPlus.jsx";

const LABELS = Object.fromEntries(SYMPTOMES.map((s) => [s.id, s.label]));

export function Suivi() {
  const data = useSuivi((s) => s.data);
  const stance = usePrefs((s) => s.stance);
  const setStance = usePrefs((s) => s.setStance);
  const setTab = useNav((s) => s.setTab);
  const [today, setToday] = useState(`Aujourd’hui`);
  useEffect(() => setToday(formatJour(dayKey())), []);
  const a = assessCombat(data);
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl">Suivi</h1>
        <p className="mt-1 text-sm text-muted">
          {today}. Ton journal et le point matin et soir, au même endroit. Tout reste sur cet appareil.
        </p>
      </div>
      {data.protocol ? (
        <>
          {a.consult || a.noWarm ? <CombatConsult /> : null}
          <CombatCheck />
        </>
      ) : (
        <Card className="p-4" data-suivi="sans-protocole">
          <p className="text-sm text-muted">
            Le point matin et soir (gorge, fièvre, frissons, mal de tête) apparaît ici pendant un protocole du Mode Combat.
          </p>
          <Button
            variant="ghost"
            className="mt-3"
            onClick={() => {
              if (stance !== `combat`) setStance(`combat`);
              setTab(`remedes`);
            }}
          >
            Voir le protocole du Mode Combat
          </Button>
        </Card>
      )}
      <JournalDuJour />
      <Historique />
      <MesDonnees />
    </div>
  );
}

function JournalDuJour() {
  const entries = useSuivi((s) => s.entries);
  const saveToday = useSuivi((s) => s.saveToday);
  const todayEntry = entries.find((e) => e.date === dayKey());
  const [intensity, setIntensity] = useState(todayEntry?.intensity ?? 4);
  const [notes, setNotes] = useState(todayEntry?.notes ?? ``);
  const [symptoms, setSymptoms] = useState(todayEntry?.symptoms ?? []);
  const [saved, setSaved] = useState(false);
  function toggle(id) {
    setSaved(false);
    setSymptoms((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));
  }
  return (
    <Card>
      <Kicker>Journal du jour</Kicker>
      <h2 className="mt-1 text-xl">Comment te sens-tu aujourd’hui ?</h2>
      <label className="mt-4 block text-sm font-medium" htmlFor="intensity">
        Intensité globale
      </label>
      <div className="mt-2 flex items-center gap-4">
        <input
          id="intensity"
          type="range"
          min={0}
          max={10}
          value={intensity}
          onChange={(e) => {
            setSaved(false);
            setIntensity(Number(e.target.value));
          }}
          className="h-11 w-full accent-primary"
        />
        <span className="w-8 text-right font-display text-3xl text-primary tabular-nums">{intensity}</span>
      </div>
      <p className="mt-1 text-xs text-muted">0 calme · 10 très atteint</p>
      <p className="mt-5 text-sm font-medium">Symptômes du jour</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {SYMPTOMES.map((e) => {
          const on = symptoms.includes(e.id);
          return (
            <button
              type="button"
              aria-pressed={on}
              onClick={() => toggle(e.id)}
              className={cn(
                `min-h-11 rounded-full border px-3 text-sm`,
                on ? `border-primary bg-primary text-primary-fg` : `border-line bg-surface text-ink`,
              )}
              key={e.id}
            >
              {e.label}
            </button>
          );
        })}
      </div>
      <label className="mt-5 block text-sm font-medium" htmlFor="notes">
        Notes
      </label>
      <textarea
        id="notes"
        rows={4}
        value={notes}
        onChange={(e) => {
          setSaved(false);
          setNotes(e.target.value);
        }}
        placeholder="Moins de congestion ce matin, toujours fatigué…"
        className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface-2 p-3 text-base outline-none placeholder:text-muted"
      />
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          onClick={() => {
            saveToday({ intensity, notes, symptoms });
            setSaved(true);
          }}
        >
          Enregistrer le jour
        </Button>
        {saved ? (
          <p className="text-sm text-primary" role="status">
            Noté.
          </p>
        ) : null}
      </div>
    </Card>
  );
}

function Historique() {
  const data = useSuivi((s) => s.data);
  const remove = useSuivi((s) => s.remove);
  const [confirming, setConfirming] = useState(null);
  const days = lastDays(14);
  const today = dayKey();
  const pastDays = [...new Set([...data.journal.map((e) => e.date), ...data.checks.map((c) => c.day)])]
    .filter((d) => d !== today)
    .sort((a, b) => b.localeCompare(a));
  const pointsOf = (d) => data.checks.filter((c) => c.day === d).sort((a, b) => a.t - b.t);
  return (
    <>
      <Card>
        <h2 className="text-lg">14 derniers jours</h2>
        {data.journal.length === 0 && data.checks.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Aucune journée enregistrée pour l’instant.</p>
        ) : (
          <div className="mt-4 flex h-24 items-end gap-1" aria-hidden="true">
            {days.map((d) => {
              const e = data.journal.find((x) => x.date === d);
              const pts = pointsOf(d);
              const v = e ? e.intensity : pts.length ? Math.max(...pts.map((p) => p.gorge)) : null;
              const fever = pts.some((p) => p.fievre) || e?.symptoms.includes(`fievre`);
              return (
                <div title={d} className="flex h-full flex-1 items-end" key={d}>
                  <div
                    className={cn(`w-full rounded-sm`, v === null ? `bg-line` : fever ? `bg-caution` : `bg-primary`)}
                    style={{ height: `${v === null ? 8 : Math.max(12, (v / 10) * 100)}%` }}
                  />
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-2 text-xs text-muted">Barre : intensité du journal (ou gorge du point). Ambre : fièvre notée.</p>
      </Card>
      {pastDays.length > 0 ? (
        <div className="space-y-3">
          {pastDays.map((d) => {
            const e = data.journal.find((x) => x.date === d);
            const pts = pointsOf(d);
            const labels = (e?.symptoms ?? []).map((s) => LABELS[s]).filter(Boolean);
            return (
              <Card className="p-4" key={d}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-sans text-base font-medium capitalize">{formatJour(d)}</h3>
                    {e ? (
                      <p className="text-sm text-muted">
                        Intensité {e.intensity}/10{labels.length > 0 ? ` · ${labels.join(`, `)}` : ``}
                      </p>
                    ) : null}
                    {pts.map((p) => (
                      <p className="text-sm text-muted" key={p.t}>
                        {p.slot === `matin` ? `Matin` : `Soir`} : gorge {p.gorge}/10
                        {p.fievre ? ` · fièvre` : ``}
                        {p.frissons ? ` · frissons` : ``}
                        {p.tete !== `non` ? ` · mal de tête ${p.tete === `intense` ? `intense` : `léger`}` : ``}
                      </p>
                    ))}
                  </div>
                  {e ? (
                    confirming === d ? (
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost" onClick={() => setConfirming(null)}>
                          Annuler
                        </Button>
                        <Button
                          size="sm"
                          variant="caution"
                          onClick={() => {
                            remove(d);
                            setConfirming(null);
                          }}
                        >
                          Effacer
                        </Button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirming(d)}
                        aria-label={`Effacer le journal du ${formatJour(d)}`}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-2"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )
                  ) : null}
                </div>
                {e?.notes ? <p className="mt-2 text-sm">{e.notes}</p> : null}
              </Card>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

function MesDonnees() {
  const data = useSuivi((s) => s.data);
  const replaceAll = useSuivi((s) => s.replaceAll);
  const clearAll = useSuivi((s) => s.clearAll);
  const fileRef = useRef(null);
  const [pending, setPending] = useState(null);
  const [msg, setMsg] = useState(``);
  const [confirmClear, setConfirmClear] = useState(false);
  const stamp = dayKey();
  const count = (d) =>
    `${d.journal.length} journée${d.journal.length > 1 ? `s` : ``}, ${d.checks.length} point${d.checks.length > 1 ? `s` : ``} matin et soir, ${d.intakes.length} geste${d.intakes.length > 1 ? `s` : ``} noté${d.intakes.length > 1 ? `s` : ``}${d.protocol ? `, un protocole en cours` : ``}`;
  async function onFile(ev) {
    const f = ev.target.files?.[0];
    ev.target.value = ``;
    setPending(null);
    if (!f) return;
    if (f.size > 2e6) return setMsg(`Fichier trop gros (2 Mo au plus).`);
    let raw;
    try {
      raw = JSON.parse(await f.text());
    } catch {
      return setMsg(`Ce fichier n’est pas un JSON valide. Rien n’a été changé.`);
    }
    const v = validate(raw);
    if (!v.ok) return setMsg(`Fichier refusé, rien n’a été changé : ${v.errors.join(` `)}`);
    setMsg(``);
    setPending(v.data);
  }
  return (
    <Card data-suivi="donnees">
      <Kicker>Sur cet appareil</Kicker>
      <h2 className="mt-1 text-xl">Mes données</h2>
      <p className="mt-2 text-sm text-muted">Actuellement : {count(data)}.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => download(`combat-le-rhume-suivi-${stamp}.json`, toJSON(data), `application/json`)}>
          Exporter mes données (JSON)
        </Button>
        <Button variant="ghost" onClick={() => download(`combat-le-rhume-suivi-${stamp}.csv`, toCSV(data, LABELS), `text/csv;charset=utf-8`)}>
          Exporter en CSV
        </Button>
        <Button variant="ghost" onClick={() => fileRef.current?.click()}>
          Importer
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" className="sr-only" tabIndex={-1} aria-hidden="true" onChange={onFile} data-suivi="fichier" />
      </div>
      <p className="mt-2 text-xs text-muted">Le JSON sert à faire une copie ou à changer d’appareil. Le CSV s’ouvre dans un tableur.</p>
      {pending ? (
        <div className="mt-4 rounded-2xl border border-line bg-surface-2 p-3" role="status">
          <p className="text-sm">Fichier valide : {count(pending)}. Il remplace les données actuelles.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                replaceAll(pending);
                setPending(null);
                setMsg(`Données importées.`);
              }}
            >
              Remplacer mes données
            </Button>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Annuler
            </Button>
          </div>
        </div>
      ) : null}
      {msg ? (
        <p className="mt-3 text-sm text-ink" role="status">
          {msg}
        </p>
      ) : null}
      <div className="mt-5 border-t border-line pt-4">
        {confirmClear ? (
          <div role="alertdialog" aria-labelledby="clr-clear-q">
            <p id="clr-clear-q" className="text-sm font-medium text-caution">
              Effacer tout le suivi de cet appareil ? Journal, points matin et soir, protocole et Kit Combat. C’est définitif : exporte d’abord si tu veux une copie.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="caution"
                onClick={() => {
                  clearAll();
                  setConfirmClear(false);
                  setMsg(`Tout le suivi a été effacé.`);
                }}
              >
                Oui, tout effacer
              </Button>
              <Button variant="ghost" onClick={() => setConfirmClear(false)}>
                Non, garder
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="caution" onClick={() => setConfirmClear(true)}>
            Tout effacer
          </Button>
        )}
        <p className="mt-2 text-xs text-muted">Les préférences (Adulte ou Enfant, mode sombre, favoris) sont gardées.</p>
      </div>
    </Card>
  );
}
