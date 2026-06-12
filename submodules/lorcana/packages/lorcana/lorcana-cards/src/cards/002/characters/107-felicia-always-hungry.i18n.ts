import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const feliciaAlwaysHungryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Felicia",
    version: "Always Hungry",
    text: "Reckless",
  },
  de: {
    name: "Felizita",
    version: "Immer hungrig",
    text: "Impulsiv",
  },
  fr: {
    name: "Félicia",
    version: "Toujours affamée",
    text: "Combattant",
  },
  it: {
    name: "Felicia",
    version: "Always Hungry",
    text: [
      {
        title: "Reckless",
        description: "(This character can't quest and must challenge each turn if able.)",
      },
    ],
  },
};
