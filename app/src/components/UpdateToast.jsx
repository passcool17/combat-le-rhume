// Mise à jour : quand une nouvelle version prend le relais, proposer de recharger.
import { useEffect, useState } from "react";

export function UpdateToast() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sw = navigator.serviceWorker;
    if (!sw) return;
    let had = !!sw.controller;
    const on = () => { if (had) setReady(true); had = true; };
    sw.addEventListener(`controllerchange`, on);
    return () => sw.removeEventListener(`controllerchange`, on);
  }, []);
  if (!ready) return null;
  return (
    <div role="status" className="clr-update fixed inset-x-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg" data-clr="mise-a-jour">
      <p className="text-sm text-ink">Une nouvelle version est prête.</p>
      <div className="flex gap-1">
        <button type="button" className="min-h-11 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg" onClick={() => location.reload()}>Recharger</button>
        <button type="button" className="min-h-11 rounded-full px-3 text-sm text-muted" onClick={() => setReady(false)}>Plus tard</button>
      </div>
    </div>
  );
}
