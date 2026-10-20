import { useEffect, useState } from "react";
import { RECETTES } from "../data/contenu.js";
import { Card } from "../components/ui.jsx";
import { cn } from "../lib/cn.js";
import { usePrefs } from "../lib/stockage.js";

export function Recettes({ openId }) {
  let [t, n] = useState(openId);
  const enfant = usePrefs((p) => p.audience) === `enfant`;
  return (
    useEffect(() => {
      openId &&
        (n(openId),
        document.getElementById(`prep-${openId}`)?.scrollIntoView({
          block: `start`,
        }));
    }, [openId]),
    (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl">Préparations</h1>
          <p className="mt-1 text-sm text-muted">
            Recettes maison. Le miel cru ne se mélange jamais avec du métal.
          </p>
        </div>
        {RECETTES.map((e) => {
          let r = t === e.id;
          return (
            <Card className="scroll-mt-24 p-0" key={e.id}>
              <h2 className="text-lg" id={`prep-${e.id}`}>
                <button
                  type="button"
                  aria-expanded={r}
                  onClick={() => n(r ? null : e.id)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                >
                  <span>{e.title}</span>
                  <span className="text-sm font-sans font-medium text-primary">
                    {r ? `Fermer` : `Voir`}
                  </span>
                </button>
              </h2>
              {r ? (
                <div className="space-y-4 border-t border-line px-5 py-4">
                  {e.intro ? (
                    <p className="text-sm text-muted">{e.intro}</p>
                  ) : null}
                  {e.ingredients ? (
                    <div>
                      <p className="text-xs font-medium tracking-wide text-muted uppercase">
                        Ingrédients
                      </p>
                      <ul className="mt-2 space-y-1.5">
                        {e.ingredients.map((e) => (
                          <li className="flex gap-2 text-sm" key={e}>
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                            <span>{e}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {e.steps ? (
                    <ol className="space-y-2">
                      {e.steps.map((e, t) => (
                        <li className="flex gap-3 text-sm" key={e}>
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary tabular-nums">
                            {t + 1}
                          </span>
                          <span className="pt-0.5">{e}</span>
                        </li>
                      ))}
                    </ol>
                  ) : null}
                  {e.blocks?.filter((b) => !(enfant && b.adulteOnly)).map((e) => (
                    <div
                      className={cn(
                        `rounded-2xl px-4 py-3`,
                        e.tone === `caution`
                          ? `bg-caution-soft`
                          : `bg-surface-2`,
                      )}
                      key={e.title}
                      data-block={e.title}
                    >
                      <h3
                        className={cn(
                          `text-base`,
                          e.tone === `caution` ? `text-caution` : `text-ink`,
                        )}
                      >
                        {e.title}
                      </h3>
                      <ul className="mt-2 space-y-1.5">
                        {e.items.map((e) => (
                          <li className="text-sm" key={e}>
                            {e}
                          </li>
                        ))}
                      </ul>
                      {e.note ? (
                        <p className="mt-2 text-sm text-muted">{e.note}</p>
                      ) : null}
                    </div>
                  ))}
                  {e.use ? (
                    <p className="text-sm">
                      <span className="font-medium">{"Usage. "}</span>
                      {e.use}
                    </p>
                  ) : null}
                  {e.caution ? (
                    <p className="text-sm text-caution">{e.caution}</p>
                  ) : null}
                </div>
              ) : null}
            </Card>
          );
        })}
      </div>
    )
  );
}
