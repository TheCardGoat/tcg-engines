import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchLittleRocketI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Little Rocket",
    text: "Rush",
  },
  de: {
    name: "Stitch",
    version: "Kleine Rakete",
    text: "Rasant",
  },
  fr: {
    name: "Stitch",
    version: "Petite fusée",
    text: "Charge",
  },
  it: {
    name: "Stitch",
    version: "Piccolo Razzo",
    text: [
      {
        title: "Lesto",
        description: "(Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
    ],
  },
};
