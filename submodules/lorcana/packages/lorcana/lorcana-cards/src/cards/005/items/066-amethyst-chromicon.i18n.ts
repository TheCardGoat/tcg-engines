import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amethystChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amethyst Chromicon",
    text: [
      {
        title: "AMETHYST LIGHT",
        description: "{E} — Each player may draw a card.",
      },
    ],
  },
  de: {
    name: "Amethyst Chromikon",
    text: [
      {
        title: "Amethystfarbenes Licht",
        description: "{E} — Alle Mitspielenden (auch du) dürfen je 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Améthyste",
    text: [
      {
        title: "Lueur d'améthyste",
        description: "{E} — Chaque joueur peut piocher une carte.",
      },
    ],
  },
  it: {
    name: "Cromicon d'Ametista",
    text: [
      {
        title: "Luce d'Ametista",
        description: "{E} — Ogni giocatore può pescare una carta.",
      },
    ],
  },
  es: {
    name: "Cromicon Amatista",
    text: [
      {
        title: "LUZ AMATISTA",
        description: "{E}: cada jugador puede robar una carta.",
      },
    ],
  },
};
