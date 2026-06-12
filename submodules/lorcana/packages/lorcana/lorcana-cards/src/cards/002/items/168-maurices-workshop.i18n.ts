import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauricesWorkshopI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maurice's Workshop",
    text: [
      {
        title: "LOOKING FOR THIS?",
        description: "Whenever you play another item, you may pay 1 {I} to draw a card.",
      },
    ],
  },
  de: {
    name: "Maurice‘ Werkstatt",
    text: [
      {
        title: "SUCHST DU DAS HIER?",
        description:
          "Jedes Mal, wenn du einen anderen Gegenstand ausspielst, darfst du 1 bezahlen, um 1 Karte zu ziehen.",
      },
    ],
  },
  fr: {
    name: "Atelier de Maurice",
    text: [
      {
        title: "C'EST ÇA QUE TU CHERCHES?",
        description:
          "Chaque fois que vous jouez un autre objet, vous pouvez payer 1 pour piocher une carte.",
      },
    ],
  },
  it: {
    name: "Maurice's Workshop",
    text: [
      {
        title: "LOOKING FOR THIS?",
        description: "Whenever you play another item, you may pay 1 to draw a card.",
      },
    ],
  },
};
