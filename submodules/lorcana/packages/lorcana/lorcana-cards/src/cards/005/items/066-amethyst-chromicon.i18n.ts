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
        title: "AMETHYSTFARBENES LICHT",
        description: "— Alle Mitspielenden (auch du) dürfen je 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Améthyste",
    text: [
      {
        title: "LUEUR",
        description: "D'AMÉTHYSTE — Chaque joueur peut piocher une carte.",
      },
    ],
  },
  it: {
    name: "Cromicon d'Ametista",
    text: [
      {
        title: "LUCE D'AMETISTA",
        description: "— Ogni giocatore può pescare una carta.",
      },
    ],
  },
};
