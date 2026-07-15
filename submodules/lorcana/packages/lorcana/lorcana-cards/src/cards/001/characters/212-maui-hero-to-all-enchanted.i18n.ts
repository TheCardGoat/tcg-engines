import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauiHeroToAllEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui",
    version: "Hero to All",
    text: [
      {
        title: "Rush",
      },
      {
        title: "Reckless",
      },
    ],
  },
  de: {
    name: "Maui",
    version: "Held von Allen",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "<Impulsiv>",
      },
    ],
  },
  fr: {
    name: "MAUI",
    version: "Idole des Hommes",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "<Combattant>",
      },
    ],
  },
  it: {
    name: "Maui",
    version: "Hero to All",
    text: [
      {
        title: "<Rush> (This character can challenge the turn they're played.)",
      },
      {
        title: "<Reckless> (This character can't quest and must challenge each turn if able.)",
      },
    ],
  },
};
