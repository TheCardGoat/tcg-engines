import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanSoldierInTrainingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Soldier in Training",
    text: "Rush",
  },
  de: {
    name: "Mulan",
    version: "Soldatin in Ausbildung",
    text: "Rasant",
  },
  fr: {
    name: "Mulan",
    version: "Tout juste sortie de l'entraînement",
    text: "Charge",
  },
  it: {
    name: "Mulan",
    version: "Soldier in Training",
    text: [
      {
        title: "Rush",
        description: "(This character can challenge the turn they're played.)",
      },
    ],
  },
};
