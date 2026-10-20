import { useEffect } from "react";
import { usePrefs } from "./lib/stockage.js";
import { useNav } from "./lib/nav.js";
import { Activity, BookOpen, ClipboardList, House, Leaf, Moon, Sprout, Stethoscope, Sun } from "./components/icones.jsx";
import { cn } from "./lib/cn.js";
import { Accueil } from "./pages/Accueil.jsx";
import { Symptomes } from "./pages/Symptomes.jsx";
import { Remedes } from "./pages/Remedes.jsx";
import { Plantes } from "./pages/Plantes.jsx";
import { Recettes } from "./pages/Recettes.jsx";
import { Conseils } from "./pages/Conseils.jsx";
import { Suivi } from "./pages/Suivi.jsx";
import { References } from "./pages/References.jsx";
import { CombatAdvice } from "./combat/CombatPlus.jsx";
import { InstallBanner, ShareButton } from "./components/Installer.jsx";
import { PENDANT_MALADIE, QUAND_CONSULTER } from "./data/contenu.js";

export function App() {
  const audience = usePrefs((e) => e.audience);
  const setAudience = usePrefs((e) => e.setAudience);
  const theme = usePrefs((e) => e.theme);
  const setTheme = usePrefs((e) => e.setTheme);
  const stance = usePrefs((e) => e.stance);
  const { tab, setTab, filter, setFilter, recipeId, recipeKey, openRecipe, openRemedies, openReferences } = useNav();
  useEffect(() => {
    document.documentElement.classList.toggle(`dark`, theme === `sombre`);
  }, [theme]);
  useEffect(() => {
    // Identité visuelle par mode : Combat (offensive, rouge) et Soutien (équipe de soutien, sarcelle).
    const h = document.documentElement;
    h.classList.toggle(`mode-combat`, stance === `combat`);
    h.classList.toggle(`mode-soutien`, stance === `soutien`);
  }, [stance]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tab]);
  useEffect(() => {
    // Mode Combat concentré : les onglets hors Combat renvoient vers Remèdes (Suivi reste accessible).
    if (stance === `combat` && HIDDEN_IN_COMBAT.includes(tab)) setTab(`remedes`);
  }, [stance, tab, setTab]);
  const combatHidden = stance === `combat` && HIDDEN_IN_COMBAT.includes(tab);
  const sections = sectionsFor(stance);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-fg">
              <Leaf className="size-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-none text-ink">
                {"Combat le "}
                <span className="italic text-primary">rhume</span>
              </p>
              <p className="mt-1 text-xs leading-snug text-muted">Aider son système immunitaire à se défendre</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={theme === `sombre`}
              aria-label={theme === `sombre` ? `Passer en mode clair` : `Passer en mode sombre`}
              onClick={() => setTheme(theme === `sombre` ? `clair` : `sombre`)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink"
            >
              {theme === `sombre` ? <Sun className="size-4" aria-hidden="true" /> : <Moon className="size-4" aria-hidden="true" />}
            </button>
            <button
              type="button"
              onClick={() => setTab(`conseils`)}
              aria-current={tab === `conseils` ? `page` : void 0}
              className={cn(
                `inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium`,
                tab === `conseils` ? `bg-primary text-primary-fg` : `border border-line bg-surface text-ink`,
              )}
            >
              <ClipboardList className="size-4" aria-hidden="true" />
              Conseils
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pb-3">
          <ShareButton />
          <div className="flex items-center gap-3">
            <p className="text-xs text-muted">Pour qui</p>
            <div className="flex rounded-full border border-line bg-surface p-0.5" role="group" aria-label="Pour qui">
              <AudienceButton current={audience} value="adulte" onSelect={setAudience} />
              <AudienceButton current={audience} value="enfant" onSelect={setAudience} />
            </div>
          </div>
        </div>
        <nav className="mx-auto hidden max-w-5xl gap-1 px-4 pb-3 md:flex" aria-label="Sections">
          {sections.map((e) => (
            <NavButton item={e} active={tab === e.id} onSelect={setTab} key={e.id} />
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pb-16">
        <InstallBanner />
        {tab === `accueil` ? <Accueil /> : null}
        {tab === `symptomes` && !combatHidden ? <Symptomes onPrep={openRecipe} onPlants={() => setTab(`plantes`)} /> : null}
        {tab === `remedes` || combatHidden ? <Remedes filter={filter} onFilter={setFilter} /> : null}
        {tab === `plantes` && !combatHidden ? <Plantes onPrep={openRecipe} /> : null}
        {tab === `recettes` && !combatHidden ? <Recettes openId={recipeId} key={recipeKey} /> : null}
        {tab === `conseils` ? (
          stance === `combat` ? (
            <CombatAdvice consult={QUAND_CONSULTER} during={PENDANT_MALADIE} onAll={() => openRemedies(`tous`)} />
          ) : (
            <Conseils />
          )
        ) : null}
        {tab === `suivi` ? <Suivi /> : null}
        {tab === `references` ? <References /> : null}
        <p className="mt-3 flex flex-wrap items-center justify-center gap-x-2 text-center text-xs text-muted">
          <span>Guide éducatif. Ton suivi ne quitte pas cet appareil.</span>
          {tab === `references` ? null : (
            <button type="button" className="clr-ref-cta text-xs" data-clr="lien-references" onClick={() => openReferences(null)}>
              Références
            </button>
          )}
        </p>
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md md:hidden"
        style={{ paddingBottom: `max(0.4rem, env(safe-area-inset-bottom))` }}
        aria-label="Sections"
      >
        <div className="grid" style={{ gridTemplateColumns: `repeat(${sections.length}, minmax(0, 1fr))` }}>
          {sections.map((e) => {
            const Icon = e.icon;
            const active = tab === e.id;
            return (
              <button
                type="button"
                onClick={() => setTab(e.id)}
                aria-current={active ? `page` : void 0}
                className={cn(
                  `flex min-h-14 flex-col items-center justify-center gap-1`,
                  sections.length > 5 ? `text-[11px]` : `text-xs`,
                  active ? `text-primary` : `text-muted`,
                )}
                key={e.id}
              >
                <Icon className="size-5" aria-hidden="true" />
                {e.label}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function AudienceButton({ current, value, onSelect }) {
  const on = current === value;
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => onSelect(value)}
      className={cn(`h-11 min-w-20 rounded-full px-3 text-sm font-medium`, on ? `bg-primary text-primary-fg` : `text-ink`)}
    >
      {value === `adulte` ? `Adulte` : `Enfant`}
    </button>
  );
}

export function NavButton({ item, active, onSelect }) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={active ? `page` : void 0}
      className={cn(
        `inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium`,
        active ? `bg-primary text-primary-fg` : `text-muted hover:bg-surface`,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {item.label}
    </button>
  );
}

export const HIDDEN_IN_COMBAT = [`symptomes`, `plantes`, `recettes`];
const sectionsFor = (stance) => (stance === `combat` ? SECTIONS.filter((e) => !HIDDEN_IN_COMBAT.includes(e.id)) : SECTIONS);
export const SECTIONS = [
  { id: `accueil`, label: `Accueil`, icon: House },
  { id: `symptomes`, label: `Symptômes`, icon: Stethoscope },
  { id: `remedes`, label: `Remèdes`, icon: Leaf },
  { id: `plantes`, label: `Plantes`, icon: Sprout },
  { id: `recettes`, label: `Recettes`, icon: BookOpen },
  { id: `suivi`, label: `Suivi`, icon: Activity },
];
