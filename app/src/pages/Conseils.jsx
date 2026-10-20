import { Card } from "../components/ui.jsx";
import { RefCard } from "./RefCard.jsx";
import { usePrefs } from "../lib/stockage.js";
import {
  PENDANT_MALADIE,
  preventionPour,
  QUAND_CONSULTER,
} from "../data/contenu.js";

export function Conseils() {
  const enfant = usePrefs((p) => p.audience) === `enfant`;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl">Conseils</h1>
        <p className="mt-1 text-sm text-muted">
          Quand s’arrêter, et ce qui aide à ne pas rechuter.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-caution/40">
          <h2 className="text-xl text-caution">Quand consulter</h2>
          <ul className="mt-3 space-y-2">
            {QUAND_CONSULTER.map((e) => (
              <li className="flex gap-2 text-sm" key={e}>
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-caution" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-xl">Prévention</h2>
          <ul className="mt-3 space-y-2">
            {preventionPour(enfant).map((e) => (
              <li className="flex gap-2 text-sm" key={e} data-prevention={e.startsWith(`Oreilles`) ? `oreilles` : undefined}>
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h2 className="text-xl">Pendant la maladie</h2>
        <ul className="mt-3 space-y-3">
          {PENDANT_MALADIE.map((e) => (
            <li className="text-sm text-ink" key={e}>
              {e}
            </li>
          ))}
        </ul>
      </Card>
      <RefCard />
    </div>
  );
}
