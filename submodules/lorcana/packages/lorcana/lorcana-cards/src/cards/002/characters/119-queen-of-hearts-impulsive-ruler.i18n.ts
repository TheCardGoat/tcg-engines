import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queenOfHeartsImpulsiveRulerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen of Hearts",
    version: "Impulsive Ruler",
    text: "Rush",
  },
  de: {
    name: "Die Herzkönigin",
    version: "Impulsive Herrscherin",
    text: "Rasant",
  },
  fr: {
    name: "La Reine de Cœur",
    version: "Souveraine impulsive",
    text: "Charge",
  },
  it: {
    name: "Queen of Hearts",
    version: "Impulsive Ruler",
    text: [
      {
        title: "Rush",
        description: "(This character can challenge the turn they're played.)",
      },
    ],
  },
};
