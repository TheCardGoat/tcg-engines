import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarMastermindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scar",
    version: "Mastermind",
    text: [
      {
        title: "INSIDIOUS PLOT",
        description:
          "When you play this character, chosen opposing character gets -5 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Scar",
    version: "Drahtzieher",
    text: [
      {
        title: "Heimtückischer Plan",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem gegnerischen Charakter deiner Wahl in diesem Zug -5 {S}.",
      },
    ],
  },
  fr: {
    name: "SCAR",
    version: "Manipulateur",
    text: [
      {
        title: "COMPLOT INSIDIEUX",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -5 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Scar",
    version: "Mastermind",
    text: [
      {
        title: "Insidious Plot",
        description:
          "When you play this character, chosen opposing character gets –5 {S} this turn.",
      },
    ],
  },
  es: {
    name: "Cicatriz",
    version: "Cerebro",
    text: [
      {
        title: "TRAMA INSIDIOSA",
        description:
          "Cuando juegas con este personaje, el personaje contrario elegido obtiene -5 {S} este turno.",
      },
    ],
  },
};
