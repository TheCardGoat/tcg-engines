import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckPerfectGentlemanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Perfect Gentleman",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "ALLOW ME",
        description: "At the start of your turn, each player may draw a card.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Perfekter Gentleman",
    text: [
      {
        title: "Gestaltwandel 3",
      },
      {
        title: "GESTATTEN?",
        description:
          "Jedes Mal zu Beginn deines Zuges dürfen alle Mitspielenden (auch du) je 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Parfait gentleman",
    text: [
      {
        title: "Alter 3",
      },
      {
        title: "PERMETTEZ-MOI",
        description: "Au début de chacun de vos tours, chaque joueur peut piocher une carte.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Perfect Gentleman",
    text: [
      {
        title: "Shift 3",
      },
      {
        title: "ALLOW ME",
        description: "At the start of your turn, each player may draw a card.",
      },
    ],
  },
};
