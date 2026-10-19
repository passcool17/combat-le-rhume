import { useJournal, usePrefs } from "./lib/stockage.js";
import { useEffect, useState } from "react";
import {
  BookOpen,
  ClipboardList,
  House,
  Leaf,
  Moon,
  Sprout,
  Stethoscope,
  Sun,
} from "./components/icones.jsx";
import { cn } from "./lib/cn.js";
import { Accueil } from "./pages/Accueil.jsx";
import { Symptomes } from "./pages/Symptomes.jsx";
import { Remedes } from "./pages/Remedes.jsx";
import { Plantes } from "./pages/Plantes.jsx";
import { Recettes } from "./pages/Recettes.jsx";
import { Conseils } from "./pages/Conseils.jsx";
import { Journal } from "./pages/Journal.jsx";
import { CombatAdvice } from "./combat/CombatPlus.jsx";
import { PENDANT_MALADIE, QUAND_CONSULTER } from "./data/contenu.js";
export function App() {
  let hydrate = useJournal((e) => e.hydrate),
    hydratePrefs = usePrefs((e) => e.hydrate),
    audience = usePrefs((e) => e.audience),
    setAudience = usePrefs((e) => e.setAudience),
    theme = usePrefs((e) => e.theme),
    setTheme = usePrefs((e) => e.setTheme),
    stance = usePrefs((e) => e.stance),
    [tab, setTab] = useState(`accueil`),
    [filter, setFilter] = useState(`tous`),
    [recipeId, setRecipeId] = useState(null),
    [recipeKey, setRecipeKey] = useState(0);
  (useEffect(() => {
    (hydrate(), hydratePrefs());
  }, [hydrate, hydratePrefs]),
    useEffect(() => {
      document.documentElement.classList.toggle(`dark`, theme === `sombre`);
    }, [theme]),
    useEffect(() => {
      window.scrollTo(0, 0);
    }, [tab]),
    useEffect(() => {
      // Mode Combat concentré : les onglets hors Combat renvoient vers Remèdes.
      stance === `combat` && HIDDEN_IN_COMBAT.includes(tab) && setTab(`remedes`);
    }, [stance, tab]));
  const combatHidden = stance === `combat` && HIDDEN_IN_COMBAT.includes(tab);
  const sections = sectionsFor(stance);
  function openRecipe(e) {
    (setRecipeId(e), setRecipeKey((e) => e + 1), setTab(`recettes`));
  }
  function openRemedies(e) {
    (setFilter(e), setTab(`remedes`));
  }
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
              <p className="mt-1 text-xs leading-snug text-muted">
                Aider son système immunitaire à se défendre
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={theme === `sombre`}
              aria-label={
                theme === `sombre`
                  ? `Passer en mode clair`
                  : `Passer en mode sombre`
              }
              onClick={() => setTheme(theme === `sombre` ? `clair` : `sombre`)}
              className="flex size-11 items-center justify-center rounded-full border border-line bg-surface text-ink"
            >
              {theme === `sombre` ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setTab(`conseils`)}
              aria-current={tab === `conseils` ? `page` : void 0}
              className={cn(
                `inline-flex h-11 items-center gap-2 rounded-full px-3 text-sm font-medium`,
                tab === `conseils`
                  ? `bg-primary text-primary-fg`
                  : `border border-line bg-surface text-ink`,
              )}
            >
              <ClipboardList className="size-4" aria-hidden="true" />
              Conseils
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 pb-3">
          <p className="text-xs text-muted">Pour qui</p>
          <div
            className="flex rounded-full border border-line bg-surface p-1"
            role="group"
            aria-label="Mode"
          >
            <AudienceButton
              current={audience}
              value="adulte"
              onSelect={setAudience}
            />
            <AudienceButton
              current={audience}
              value="enfant"
              onSelect={setAudience}
            />
          </div>
        </div>
        <nav
          className="mx-auto hidden max-w-5xl gap-1 px-4 pb-3 md:flex"
          aria-label="Sections"
        >
          {sections.map((e) => (
            <NavButton
              item={e}
              active={tab === e.id}
              onSelect={setTab}
              key={e.id}
            />
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 pt-5 pb-28 md:pb-16">
        {tab === `accueil` ? (
          <Accueil
            onRemedies={openRemedies}
            onAdvice={() => setTab(`conseils`)}
            onPlants={() => setTab(`plantes`)}
            onJournal={() => setTab(`journal`)}
          />
        ) : null}
        {tab === `symptomes` && !combatHidden ? (
          <Symptomes onPrep={openRecipe} onPlants={() => setTab(`plantes`)} />
        ) : null}
        {tab === `remedes` || combatHidden ? (
          <Remedes filter={filter} onFilter={setFilter} />
        ) : null}
        {tab === `plantes` && !combatHidden ? <Plantes onPrep={openRecipe} /> : null}
        {tab === `recettes` && !combatHidden ? (
          <Recettes openId={recipeId} key={recipeKey} />
        ) : null}
        {tab === `conseils` ? (
          stance === `combat` ? (
            <CombatAdvice consult={QUAND_CONSULTER} during={PENDANT_MALADIE} onAll={() => openRemedies(`tous`)} />
          ) : (
            <Conseils />
          )
        ) : null}
        {tab === `journal` && !combatHidden ? <Journal /> : null}
        <p className="mt-8 text-center text-xs text-muted">
          Guide éducatif. Le journal ne quitte pas cet appareil.
        </p>
      </main>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md md:hidden"
        style={{
          paddingBottom: `max(0.4rem, env(safe-area-inset-bottom))`,
        }}
        aria-label="Sections"
      >
        <div className={stance === `combat` ? `grid grid-cols-2` : `grid grid-cols-5`}>
          {sections.map((e) => {
            let Icon = e.icon,
              n = tab === e.id;
            return (
              <button
                type="button"
                onClick={() => setTab(e.id)}
                aria-current={n ? `page` : void 0}
                className={cn(
                  `flex min-h-14 flex-col items-center justify-center gap-1 text-xs`,
                  n ? `text-primary` : `text-muted`,
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
  let r = current === value;
  return (
    <button
      type="button"
      aria-pressed={r}
      onClick={() => onSelect(value)}
      className={cn(
        `h-9 min-w-20 rounded-full px-3 text-sm font-medium`,
        r ? `bg-primary text-primary-fg` : `text-ink`,
      )}
    >
      {value === `adulte` ? `Adulte` : `Enfant`}
    </button>
  );
}
export function NavButton({ item, active, onSelect }) {
  let Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      aria-current={active ? `page` : void 0}
      className={cn(
        `inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium`,
        active ? `bg-primary text-primary-fg` : `text-muted hover:bg-surface`,
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
      {item.label}
    </button>
  );
}
export const HIDDEN_IN_COMBAT = [`symptomes`, `plantes`, `recettes`, `journal`];
const sectionsFor = (stance) => (stance === `combat` ? SECTIONS.filter((e) => !HIDDEN_IN_COMBAT.includes(e.id)) : SECTIONS);
export const SECTIONS = [
  {
    id: `accueil`,
    label: `Accueil`,
    icon: House,
  },
  {
    id: `symptomes`,
    label: `Symptômes`,
    icon: Stethoscope,
  },
  {
    id: `remedes`,
    label: `Remèdes`,
    icon: Leaf,
  },
  {
    id: `plantes`,
    label: `Plantes`,
    icon: Sprout,
  },
  {
    id: `recettes`,
    label: `Recettes`,
    icon: BookOpen,
  },
];
