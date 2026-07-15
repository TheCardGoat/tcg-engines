import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mrsPottsHeadHousekeeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mrs. Potts",
    version: "Head Housekeeper",
    text: [
      {
        title: "CLEAN UP",
        description: "{E}, Banish one of your items — Draw a card.",
      },
    ],
  },
  de: {
    name: "Mme. Pottine",
    version: "Hausdame",
    text: [
      {
        title: "Aufräumen",
        description: "{E}, Verbanne einen deiner Gegenstände — Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Madame Samovar",
    version: "Gouvernante en chef",
    text: [
      {
        title: "Nettoyage",
        description: "{E}, Bannissez l'un de vos objets — Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Mrs. Bric",
    version: "Prima Governante",
    text: [
      {
        title: "Pulizia",
        description: "{E}, esilia uno dei tuoi oggetti — Pesca una carta.",
      },
    ],
  },
};
