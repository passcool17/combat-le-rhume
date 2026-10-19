import { useMemo, useState } from "react";
import { useJournal } from "../lib/stockage.js";
import { SYMPTOMES, SYMPTOMES_PRINCIPAUX } from "../data/contenu.js";
import { cn } from "../lib/cn.js";
import { Button, Card } from "../components/ui.jsx";

export function Symptomes({ onPrep, onPlants }) {
  let [n, r] = useState([]),
    [i, a] = useState(false),
    saveToday = useJournal((e) => e.saveToday),
    s = useMemo(
      () =>
        SYMPTOMES.filter(
          (e) => !SYMPTOMES_PRINCIPAUX.includes(e.id) && n.includes(e.id),
        ),
      [n],
    ),
    c = SYMPTOMES_PRINCIPAUX.map((e) =>
      SYMPTOMES.find((t) => t.id === e),
    ).filter((e) => e != null),
    l = SYMPTOMES.filter((e) => !SYMPTOMES_PRINCIPAUX.includes(e.id));
  function u(e) {
    (a(false),
      r((t) => (t.includes(e) ? t.filter((t) => t !== e) : [...t, e])));
  }
  function d() {
    (saveToday({
      symptoms: n,
    }),
      a(true));
  }
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl">Selon tes symptômes</h1>
        <p className="mt-1 text-sm text-muted">
          Fièvre, toux et congestion d’abord. Les autres symptômes s’ajoutent
          en dessous.
        </p>
      </div>
      <div className="space-y-3">
        {c.map((n) => (
          <SymptomeDetail
            symptom={n}
            title={n.id === `nez-bouche` ? `Congestion` : n.title}
            onPrep={onPrep}
            onPlants={n.id === `toux` ? onPlants : void 0}
            key={n.id}
          />
        ))}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium">Autres symptômes</p>
        <div className="flex flex-wrap gap-2">
          {l.map((e) => {
            let t = n.includes(e.id);
            return (
              <button
                type="button"
                aria-pressed={t}
                onClick={() => u(e.id)}
                className={cn(
                  `min-h-11 rounded-full border px-4 text-sm font-medium`,
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
      </div>
      {s.length > 0 ? (
        <div className="space-y-3">
          {s.map((t) => (
            <SymptomeDetail symptom={t} onPrep={onPrep} key={t.id} />
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={d}>Noter dans mon suivi</Button>
            {i ? (
              <p className="text-sm text-primary">
                Enregistré pour aujourd’hui.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SymptomeDetail({ symptom, onPrep, onPlants, title }) {
  return (
    <Card className="border-l-4 border-l-primary">
      <h2 className="text-xl text-primary">{title ?? symptom.title}</h2>
      <ul className="mt-3 space-y-3">
        {symptom.tips.map((e) => (
          <li key={e.lead}>
            <p className="text-sm">
              <span className="font-medium">
                {e.lead}
                {". "}
              </span>
              <span className="text-muted">{e.detail}</span>
            </p>
            {e.prepId ? (
              <button
                type="button"
                onClick={() => onPrep(e.prepId)}
                className="inline-flex min-h-11 items-center text-sm font-medium text-primary"
              >
                Ouvrir la préparation
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      {onPlants ? (
        <button
          type="button"
          onClick={onPlants}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary"
        >
          Voir les plantes pour la toux
        </button>
      ) : null}
    </Card>
  );
}
