import { usePrefs } from "../lib/stockage.js";
import {
  PLANTES_RECETTES,
  PLANTES_TOUX,
  REMEDES,
  TOUX_CONSEIL,
} from "../data/contenu.js";
import { Card } from "../components/ui.jsx";
import { doseEnfant } from "../lib/outils.js";
import { cn } from "../lib/cn.js";

export function Plantes({ onPrep }) {
  let audience = usePrefs((e) => e.audience),
    n = PLANTES_TOUX.map((e) => REMEDES.find((t) => t.id === e)).filter(
      (e) => e != null,
    );
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl">Plantes pour la toux</h1>
        <p className="mt-1 text-sm text-muted">
          Toux grasse ou gorge irritée. Commencer doux, et observer la réaction.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {n.map((n) => {
          let r = PLANTES_RECETTES[n.id];
          return (
            <Card key={n.id}>
              <p className="text-xs font-medium tracking-widest text-primary uppercase">
                {n.kicker}
              </p>
              <h2 className="mt-1 text-xl">{n.name}</h2>
              <p className="mt-2 text-sm">
                {audience === `enfant` ? doseEnfant(n.id) : n.how}
              </p>
              {audience === `enfant` ? (
                <p className="mt-2 text-sm text-muted">
                  {"Adulte : "}
                  {n.how}
                </p>
              ) : null}
              {n.extra?.map((e) => (
                <p className="mt-2 text-sm text-muted" key={e}>
                  {e}
                </p>
              ))}
              {r ? (
                <button
                  type="button"
                  onClick={() => onPrep(r)}
                  className={cn(`mt-2 inline-flex min-h-11 items-center text-sm font-medium text-primary`)}
                >
                  Voir la préparation
                </button>
              ) : null}
            </Card>
          );
        })}
      </div>
      <Card>
        <h2 className="text-lg">Si la toux s’installe</h2>
        <p className="mt-2 text-sm text-muted">{TOUX_CONSEIL}</p>
      </Card>
    </div>
  );
}
