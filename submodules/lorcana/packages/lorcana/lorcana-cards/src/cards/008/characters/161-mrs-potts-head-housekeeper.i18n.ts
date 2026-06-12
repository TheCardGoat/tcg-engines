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
        title: "AUFRÄUMEN,",
        description: "Verbanne einen deiner Gegenstände — Ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Madame Samovar",
    version: "Gouvernante en chef",
    text: [
      {
        title: "NETTOYAGE,",
        description: "Bannissez l'un de vos objets — Piochez une carte.",
      },
    ],
  },
  it: {
    name: "Mrs. Bric",
    version: "Prima Governante",
    text: [
      {
        title: "PULIZIA,",
        description: "esilia uno dei tuoi oggetti — Pesca una carta.",
      },
    ],
  },
};
