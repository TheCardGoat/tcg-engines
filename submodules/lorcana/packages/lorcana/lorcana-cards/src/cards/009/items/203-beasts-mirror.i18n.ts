import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const beastsMirrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Beast’s Mirror",
    text: [
      {
        title: "Show Me",
        description: "{E}, 3 {I} — If you have no cards in your hand, draw a card.",
      },
    ],
  },
  de: {
    name: "Spiegel des Biests",
    text: [
      {
        title: "Zeig's mir",
        description: "{E}, 3 {I} — Wenn du keine Karten auf der Hand hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "MIROIR DE LA BÊTE",
    text: [
      {
        title: "MONTRE-MOI",
        description: "{E}, 3 {I} — Si vous n'avez plus de carte en main, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Beast’s Mirror",
    text: [
      {
        title: "Show Me",
        description: "{E}, 3 {I} — If you have no cards in your hand, draw a card.",
      },
    ],
  },
};
