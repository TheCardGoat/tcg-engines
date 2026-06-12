import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicaDeSpellCruelSorceressI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magica De Spell",
    version: "Cruel Sorceress",
    text: [
      {
        title: "PLAYING WITH POWER",
        description:
          "During opponents' turns, if an effect would cause you to discard one or more cards from your hand, you don't discard.",
      },
    ],
  },
  de: {
    name: "Gundel Gaukeley",
    version: "Grausame Hexe",
    text: [
      {
        title: "MIT DER MACHT SPIELEN",
        description:
          "Wenn du im Zug einer gegnerischen Person 1 oder mehr Karten abwerfen müsstest, musst du keine Karten abwerfen.",
      },
    ],
  },
  fr: {
    name: "Miss Tick",
    version: "Cruelle sorcière",
    text: [
      {
        title: "JOUER AVEC LE FEU",
        description:
          "Durant le tour de vos adversaires, si un effet devait vous faire défausser une ou plusieurs cartes de votre main, vous n'en défaussez aucune.",
      },
    ],
  },
  it: {
    name: "Amelia",
    version: "Crudele Incantatrice",
    text: [
      {
        title: "GIOCARE CON IL POTERE",
        description:
          "Durante il turno degli avversari, se un effetto ti farebbe scartare una o più carte dalla tua mano, non scartarne.",
      },
    ],
  },
};
