// Navigation entre les onglets (accessible partout, y compris dans le Mode Combat).
import { create } from "zustand";

export const useNav = create((set) => ({
  tab: `accueil`,
  filter: `tous`,
  recipeId: null,
  recipeKey: 0,
  refAnchor: null,
  setTab: (tab) => set({ tab }),
  setFilter: (filter) => set({ filter }),
  openRemedies: (filter) => set({ filter, tab: `remedes` }),
  // Références : ouvre la vue, et au besoin le groupe d’un remède (ex. `zinc`).
  openReferences: (refAnchor = null) => set({ refAnchor, tab: `references` }),
  openRecipe: (recipeId) =>
    set((s) => ({ recipeId, recipeKey: s.recipeKey + 1, tab: `recettes` })),
}));
