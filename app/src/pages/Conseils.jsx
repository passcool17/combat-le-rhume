import { Card } from "../components/ui.jsx";
import {
  PENDANT_MALADIE,
  PREVENTION,
  QUAND_CONSULTER,
} from "../data/contenu.js";

export function Conseils() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl">Conseils</h2>
        <p className="mt-1 text-sm text-muted">
          Quand s’arrêter, et ce qui aide à ne pas rechuter.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <Card className="border-caution/40">
          <h3 className="text-xl text-caution">Quand consulter</h3>
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
          <h3 className="text-xl">Prévention</h3>
          <ul className="mt-3 space-y-2">
            {PREVENTION.map((e) => (
              <li className="flex gap-2 text-sm" key={e}>
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <h3 className="text-xl">Pendant la maladie</h3>
        <ul className="mt-3 space-y-3">
          {PENDANT_MALADIE.map((e) => (
            <li className="text-sm text-ink" key={e}>
              {e}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
