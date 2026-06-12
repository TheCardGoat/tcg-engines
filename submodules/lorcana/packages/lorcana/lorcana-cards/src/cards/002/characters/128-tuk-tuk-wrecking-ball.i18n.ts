import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tukTukWreckingBallI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tuk Tuk",
    version: "Wrecking Ball",
    text: "Reckless",
  },
  de: {
    name: "Tuktuk",
    version: "Abrisskugel",
    text: "Impulsiv",
  },
  fr: {
    name: "Tuk Tuk",
    version: "Boule de démolition",
    text: "Combattant",
  },
  it: {
    name: "Tuk Tuk",
    version: "Wrecking Ball",
    text: [
      {
        title: "Reckless",
        description: "(This character can't quest and must challenge each turn if able.)",
      },
    ],
  },
};
