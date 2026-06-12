import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theNokkWaterSpiritI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Nokk",
    version: "Water Spirit",
    text: "Ward",
  },
  de: {
    name: "Der Nokk",
    version: "Geist des Wassers",
    text: "Behütet",
  },
  fr: {
    name: "Nokk",
    version: "Esprit de l'Eau",
    text: "Hors d'atteinte",
  },
  it: {
    name: "The Nokk",
    version: "Water Spirit",
    text: [
      {
        title: "Ward",
        description: "(Opponents can't choose this character except to challenge.)",
      },
    ],
  },
};
