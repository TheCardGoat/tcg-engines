import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const weightSetI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Weight Set",
    text: [
      {
        title: "TRAINING",
        description:
          "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
      },
    ],
  },
  de: {
    name: "Hantel",
    text: [
      {
        title: "KRAFTTRAINING",
        description:
          "Jedes Mal, wenn du einen Charakter mit 4 oder mehr ausspielst, darfst du 1 bezahlen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Haltères",
    text: [
      {
        title: "ENTRAINEMENT",
        description:
          "Chaque fois que vous jouez un personnage ayant au moins 4, vous pouvez payer 1 pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Weight Set",
    text: [
      {
        title: "TRAINING",
        description: "Whenever you play a character with 4 or more, you may pay 1 to draw a card.",
      },
    ],
  },
};
