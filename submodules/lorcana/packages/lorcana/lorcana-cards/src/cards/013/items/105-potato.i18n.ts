import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const potatoI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Potato",
    text: [
      {
        title: "FULL OF POTENTIAL",
        description: "This item enters play exerted.",
      },
    ],
  },
  de: {
    name: "Kartoffel",
    text: [
      {
        title: "Voller Potenzial",
        description: "Dieser Gegenstand kommt erschöpft ins Spiel.",
      },
    ],
  },
  fr: {
    name: "Patate",
    text: [
      {
        title: "Pleine de potentiel",
        description: "Cet objet entre en jeu épuisé.",
      },
    ],
  },
  it: {
    name: "Patata",
    text: [
      {
        title: "Piena di Potenziale",
        description: "Questo oggetto entra in gioco impegnato.",
      },
    ],
  },
};
