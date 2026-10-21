// Hors ligne : indicateur discret « ✓ Disponible hors ligne » et message quand un lien externe est touché sans connexion.
import { useEffect, useState } from "react";

/** Demande au service worker si tout le build est en cache. */
export function useDisponibleHorsLigne() {
  const [pret, setPret] = useState(false);
  useEffect(() => {
    const sw = navigator.serviceWorker;
    if (!sw) return;
    let stop = false;
    const onMsg = (e) => {
      if (e.data?.type === `clr-etat` && !stop) setPret(!!e.data.pret);
    };
    const ask = () => sw.ready.then((r) => (sw.controller || r.active)?.postMessage({ type: `clr-etat` })).catch(() => {});
    sw.addEventListener(`message`, onMsg);
    sw.addEventListener(`controllerchange`, ask);
    ask();
    return () => {
      stop = true;
      sw.removeEventListener(`message`, onMsg);
      sw.removeEventListener(`controllerchange`, ask);
    };
  }, []);
  return pret;
}

export function DisponibleHorsLigne() {
  const pret = useDisponibleHorsLigne();
  if (!pret) return null;
  return (
    <span data-clr="hors-ligne-pret" title="Toute l’appli est enregistrée sur cet appareil : elle fonctionne aussi sans connexion.">
      ✓ Disponible hors ligne
    </span>
  );
}

/** Sans connexion, un lien externe (publication X, étude…) affiche un petit message au lieu d’une page d’erreur. */
export function LienHorsLigne() {
  const [vu, setVu] = useState(0);
  useEffect(() => {
    const onClick = (e) => {
      if (navigator.onLine) return;
      const a = e.target instanceof Element ? e.target.closest(`a[href]`) : null;
      if (!a) return;
      const u = new URL(a.href, location.href);
      if (!/^https?:$/.test(u.protocol) || u.origin === location.origin) return;
      e.preventDefault();
      setVu((n) => n + 1);
    };
    document.addEventListener(`click`, onClick, true);
    return () => document.removeEventListener(`click`, onClick, true);
  }, []);
  useEffect(() => {
    if (!vu) return;
    const t = setTimeout(() => setVu(0), 4500);
    const on = () => setVu(0);
    addEventListener(`online`, on);
    return () => {
      clearTimeout(t);
      removeEventListener(`online`, on);
    };
  }, [vu]);
  if (!vu) return null;
  return (
    <div role="status" className="clr-update fixed inset-x-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-lg" data-clr="lien-hors-ligne" key={vu}>
      <p className="text-sm text-ink">📶 Pas de connexion : ce lien s’ouvrira quand tu seras en ligne.</p>
      <button type="button" className="min-h-11 shrink-0 rounded-full px-3 text-sm text-muted" onClick={() => setVu(0)}>OK</button>
    </div>
  );
}
