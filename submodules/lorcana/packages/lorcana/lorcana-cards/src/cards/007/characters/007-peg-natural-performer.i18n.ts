import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pegNaturalPerformerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peg",
    version: "Natural Performer",
    text: [
      {
        title: "CAPTIVE AUDIENCE",
        description: "{E} — If you have 3 or more other characters in play, draw a card.",
      },
    ],
  },
  de: {
    name: "Peggy",
    version: "Naturtalent im Auftreten",
    text: [
      {
        title: "DAS PUBLIKUM IM BANN",
        description: "— Wenn du mindestens 3 weitere Charaktere im Spiel hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Peg",
    version: "Née pour la scène",
    text: [
      {
        title: "AUDITOIRE",
        description:
          "CAPTIVÉ — Si vous avez au moins 3 autres personnages en jeu, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Gilda",
    version: "Intrattenitrice Nata",
    text: [
      {
        title: "PUBBLICO RAPITO",
        description: "— Se hai in gioco 3 o più altri personaggi, pesca una carta.",
      },
    ],
  },
};
