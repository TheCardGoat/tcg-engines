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
        title: "Krafttraining",
        description:
          "Jedes Mal, wenn du einen Charakter mit 4 oder mehr {S} ausspielst, darfst du 1 {I} bezahlen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Haltères",
    text: [
      {
        title: "Entrainement",
        description:
          "Chaque fois que vous jouez un personnage ayant au moins 4 {S}, vous pouvez payer 1 {I} pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Weight Set",
    text: [
      {
        title: "Training",
        description:
          "Whenever you play a character with 4 {S} or more, you may pay 1 {I} to draw a card.",
      },
    ],
  },
  es: {
    name: "Juego de pesas",
    text: [
      {
        title: "CAPACITACIÓN",
        description:
          "Siempre que juegues con un personaje con 4 {S} o más, puedes pagar 1 {I} para robar una carta.",
      },
    ],
  },
};
