// Carte d’accès aux Références (onglet Conseils, dans les deux modes).
import { useNav } from "../lib/nav.js";
import { REFERENCES } from "../data/references.js";

export function RefCard() {
  const openReferences = useNav((n) => n.openReferences);
  return (
    <section className="rounded-[var(--radius-card)] border border-line bg-surface p-5" data-clr="carte-references">
      <h2 className="text-xl">Références</h2>
      <p className="mt-1 text-sm text-muted">{REFERENCES.length} publications publiques de médecins sur X, regroupées par remède. Elles ne remplacent pas un avis médical.</p>
      <button type="button" className="clr-ref-link mt-3" onClick={() => openReferences(null)}>Voir les références</button>
    </section>
  );
}
