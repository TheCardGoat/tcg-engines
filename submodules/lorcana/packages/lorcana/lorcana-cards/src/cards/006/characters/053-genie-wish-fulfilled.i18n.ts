import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const genieWishFulfilledI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Genie",
    version: "Wish Fulfilled",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "WHAT HAPPENS NOW?",
        description: "When you play this character, draw a card.",
      },
    ],
  },
  de: {
    name: "Dschinni",
    version: "Wunsch erfüllt",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "WAS KOMMT JETZT?",
        description: "Wenn du diesen Charakter ausspielst, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Vœu exaucé",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "QUE ME RÉSERVE L'AVENIR?",
        description: "Lorsque vous jouez ce personnage, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Desiderio Esaudito",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "E ORA CHE SI FA? Quando giochi questo personaggio, pesca una carta.",
      },
    ],
  },
};
