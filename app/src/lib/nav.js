// Navigation entre les onglets (accessible partout, y compris dans le Mode Combat).
import { create } from "zustand";

export const useNav = create((set) => ({
  tab: `accueil`,
  filter: `tous`,
  recipeId: null,
  recipeKey: 0,
  setTab: (tab) => set({ tab }),
  setFilter: (filter) => set({ filter }),
  openRemedies: (filter) => set({ filter, tab: `remedes` }),
  openRecipe: (recipeId) =>
    set((s) => ({ recipeId, recipeKey: s.recipeKey + 1, tab: `recettes` })),
}));
