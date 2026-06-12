import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const baymaxLowBatteryI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Baymax",
    version: "Low Battery",
    text: [
      {
        title: "SHHHHH",
        description: "This character enters play exerted.",
      },
    ],
  },
  de: {
    name: "Baymax",
    version: "Niedriger Akkustand",
    text: [
      {
        title: "SCHHHHH",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Batterie faible",
    text: [
      {
        title: "PSSSHH",
        description: "Ce personnage entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Batteria Scarica",
    text: [
      {
        title: "SHHHHH",
        description: "Questo personaggio entra in gioco impegnato.",
      },
    ],
  },
};
