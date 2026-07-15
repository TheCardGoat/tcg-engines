import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kronkLaidBackP2ChallengeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kronk",
    version: "Laid Back",
    text: [
      {
        title: "Ward",
      },
      {
        title: "I'M LOVIN' THIS",
        description:
          "If an effect would cause you to discard one or more cards, you don't discard.",
      },
    ],
  },
  de: {
    name: "Kronk",
    version: "Entspannt",
    text: [
      {
        title: "<Behütet>",
      },
      {
        title: "Das gefällt mir",
        description:
          "Wenn du durch einen Effekt 1 oder mehr Karten abwerfen müsstest, wirfst du keine Karten ab.",
      },
    ],
  },
  fr: {
    name: "Kronk",
    version: "Décontracté",
    text: [
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Qu'est-ce que j'm'amuse",
        description:
          "Si un effet devait vous faire défausser une ou plusieurs cartes, ne les défaussez pas.",
      },
    ],
  },
  it: {
    name: "Kronk",
    version: "Rilassato",
    text: [
      {
        title: "<Protetto>",
      },
      {
        title: "Lo Adoro",
        description: "Se un effetto ti farebbe scartare una o più carte, non scartarne.",
      },
    ],
  },
};
