import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const merryweatherGoodFairyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merryweather",
    version: "Good Fairy",
    text: [
      {
        title: "RAY OF HOPE",
        description:
          "When you play this character, you may pay 1 {I} to give chosen character +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Sonnenschein",
    version: "Gute Fee",
    text: [
      {
        title: "EIN FÜNKCHEN HOFFNUNG",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 bezahlen, um einem Charakter deiner Wahl in diesem Zug +2 zu geben.",
      },
    ],
  },
  fr: {
    name: "Pimprenelle",
    version: "Bonne fée",
    text: [
      {
        title: "UN PEU D'ESPOIR",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez payer 1 pour choisir un personnage qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Serenella",
    version: "Buona Fata",
    text: [
      {
        title: "CHE LA SPERANZA MAI TI ABBANDONI",
        description:
          "Quando giochi questo personaggio, puoi pagare 1 per dare a un personaggio a tua scelta +2 per questo turno.",
      },
    ],
  },
};
