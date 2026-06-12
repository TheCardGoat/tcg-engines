import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarEerilyPreparedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Eerily Prepared",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "SURVIVAL OF THE FITTEST",
        description:
          "Whenever you put a card under this character, chosen opposing character gets -5 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Unheimlich bereit",
    text: [
      {
        title: "Stärken 2",
      },
      {
        title: "DAS ÜBERLEBEN DES STÄRKEREN",
        description:
          "Jedes Mal, wenn du eine Karte unter diesen Charakter legst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -5.",
      },
    ],
  },
  fr: {
    name: "Scar",
    version: "Étrangement prêt",
    text: [
      {
        title: "Boost 2",
      },
      {
        title: "SURVIE DU PLUS APTE",
        description:
          "Chaque fois que vous placez une carte sous ce personnage, choisissez un personnage adverse qui subit -5 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Misteriosamente Pronto",
    text: [
      {
        title: "Potenziamento 2",
      },
      {
        title: "LEGGE DELLA GIUNGLA",
        description:
          "Ogni volta che metti una carta sotto a questo personaggio, un personaggio avversario a tua scelta riceve -5 per questo turno.",
      },
    ],
  },
};
