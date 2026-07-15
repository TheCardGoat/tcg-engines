import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sleepyNoddingOffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sleepy",
    version: "Nodding Off",
    text: [
      {
        title: "YAWN!",
        description: "This character enters play exerted.",
      },
    ],
  },
  de: {
    name: "Schlafmütz",
    version: "Am Dösen",
    text: [
      {
        title: "Gähn!",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Dormeur",
    version: "Tombe de fatigue",
    text: [
      {
        title: "Baaaille...",
        description: "Ce personnage entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Sleepy",
    version: "Nodding Off",
    text: [
      {
        title: "Yawn!",
        description: "This character enters play exerted.",
      },
    ],
  },
};
