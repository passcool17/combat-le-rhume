import { useJournal } from "../lib/stockage.js";
import { dayKey, formatJour, lastDays } from "../lib/outils.js";
import { useEffect, useState } from "react";
import { Button, Card } from "../components/ui.jsx";
import { SYMPTOMES } from "../data/contenu.js";
import { cn } from "../lib/cn.js";
import { Trash2 } from "../components/icones.jsx";

export function Journal() {
  let hydrated = useJournal((e) => e.hydrated),
    entries = useJournal((e) => e.entries),
    saveToday = useJournal((e) => e.saveToday),
    remove = useJournal((e) => e.remove),
    i = dayKey(),
    a = entries.find((e) => e.date === i),
    [o, s] = useState(4),
    [c, l] = useState(``),
    [u, d] = useState([]),
    [f, p] = useState(false),
    [m, h] = useState(false),
    [g, _] = useState(null),
    [y, b] = useState(`Aujourd’hui`);
  (useEffect(() => {
    b(formatJour(dayKey()));
  }, []),
    useEffect(() => {
      hydrated &&
        !f &&
        (s(a?.intensity ?? 4),
        l(a?.notes ?? ``),
        d(a?.symptoms ?? []),
        p(true));
    }, [hydrated, f, a]));
  function ee(e) {
    (h(false),
      d((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e])));
  }
  function te() {
    (saveToday({
      intensity: o,
      notes: c,
      symptoms: u,
    }),
      h(true));
  }
  let x = entries.filter((e) => e.date !== i),
    C = lastDays(14);
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl">Journal</h2>
        <p className="mt-1 text-sm text-muted">
          {y}. Tout reste sur cet appareil.
        </p>
      </div>
      <Card>
        <label className="block text-sm font-medium" htmlFor="intensity">
          Intensité globale
        </label>
        <div className="mt-3 flex items-center gap-4">
          <input
            id="intensity"
            type="range"
            min={0}
            max={10}
            value={o}
            onChange={(e) => {
              (h(false), s(Number(e.target.value)));
            }}
            className="h-2 w-full accent-primary"
          />
          <span className="w-8 text-right font-display text-3xl text-primary tabular-nums">
            {o}
          </span>
        </div>
        <p className="mt-1 text-xs text-muted">0 calme · 10 très atteint</p>
        <p className="mt-5 text-sm font-medium">Symptômes du jour</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {SYMPTOMES.map((e) => {
            let t = u.includes(e.id);
            return (
              <button
                type="button"
                aria-pressed={t}
                onClick={() => ee(e.id)}
                className={cn(
                  `min-h-10 rounded-full border px-3 text-sm`,
                  t
                    ? `border-primary bg-primary text-primary-fg`
                    : `border-line bg-surface text-ink`,
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
          value={c}
          onChange={(e) => {
            (h(false), l(e.target.value));
          }}
          placeholder="Moins de congestion ce matin, toujours fatigué…"
          className="mt-2 w-full resize-none rounded-2xl border border-line bg-surface-2 p-3 text-base outline-none placeholder:text-muted"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Button onClick={te}>Enregistrer le jour</Button>
          {m ? <p className="text-sm text-primary">Noté.</p> : null}
        </div>
      </Card>
      <Card>
        <h3 className="text-lg">14 derniers jours</h3>
        {entries.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            Aucune journée enregistrée pour l’instant.
          </p>
        ) : (
          <div className="mt-4 flex h-24 items-end gap-1" aria-hidden="true">
            {C.map((e) => {
              let n = entries.find((t) => t.date === e),
                r = n ? Math.max(12, (n.intensity / 10) * 100) : 8;
              return (
                <div title={e} className="flex h-full flex-1 items-end" key={e}>
                  <div
                    className={cn(
                      `w-full rounded-sm`,
                      n ? `bg-primary` : `bg-line`,
                    )}
                    style={{
                      height: `${r}%`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </Card>
      {x.length > 0 ? (
        <div className="space-y-3">
          {x.map((e) => (
            <JournalEntry
              entry={e}
              confirming={g === e.date}
              onAsk={() => _(e.date)}
              onCancel={() => _(null)}
              onRemove={() => {
                (remove(e.date), _(null));
              }}
              key={e.date}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function JournalEntry({ entry, confirming, onAsk, onCancel, onRemove }) {
  let a = entry.symptoms
    .map((e) => SYMPTOMES.find((t) => t.id === e)?.label)
    .filter(Boolean);
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-medium capitalize">{formatJour(entry.date)}</p>
          <p className="text-sm text-muted">
            {"Intensité "}
            {entry.intensity}/10{a.length > 0 ? ` · ${a.join(`, `)}` : ``}
          </p>
        </div>
        {confirming ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-muted"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="text-sm font-medium text-caution"
            >
              Effacer
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onAsk}
            aria-label={`Effacer le ${formatJour(entry.date)}`}
            className="text-muted"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
      {entry.notes ? <p className="mt-2 text-sm">{entry.notes}</p> : null}
    </Card>
  );
}
