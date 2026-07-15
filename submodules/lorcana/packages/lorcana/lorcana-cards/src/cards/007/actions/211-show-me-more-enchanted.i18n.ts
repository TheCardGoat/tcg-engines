import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const showMeMoreEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Show Me More!",
    text: "Each player draws 3 cards.",
  },
  de: {
    name: "Zeig mir mehr!",
    text: [
      {
        title: "Alle Mitspielenden",
        description: "(auch du) ziehen je 3 Karten.",
      },
    ],
  },
  fr: {
    name: "Montre-m’en davantage !",
    text: "Chaque joueur pioche 3 cartes.",
  },
  it: {
    name: "Mostrami di Più!",
    text: "Ogni giocatore pesca 3 carte.",
  },
};
