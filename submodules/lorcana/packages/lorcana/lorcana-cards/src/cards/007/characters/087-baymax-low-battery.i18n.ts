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
        title: "Schhhhh",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Baymax",
    version: "Batterie faible",
    text: [
      {
        title: "Pssshh",
        description: "Ce personnage entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Baymax",
    version: "Batteria Scarica",
    text: [
      {
        title: "Shhhhh",
        description: "Questo personaggio entra in gioco impegnato.",
      },
    ],
  },
  es: {
    name: "Baymax",
    version: "Batería baja",
    text: [
      {
        title: "SHHHHH",
        description: "Este personaje entra en juego ejercido.",
      },
    ],
  },
};
