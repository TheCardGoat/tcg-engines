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
        title: "<Wendig>",
      },
      {
        title: "Was kommt jetzt?",
        description: "Wenn du diesen Charakter ausspielst, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Génie",
    version: "Vœu exaucé",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Que me réserve l'avenir?",
        description: "Lorsque vous jouez ce personnage, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Genio",
    version: "Desiderio Esaudito",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "E Ora Che si Fa?",
        description: "Quando giochi questo personaggio, pesca una carta.",
      },
    ],
  },
  es: {
    name: "Genio",
    version: "Deseo cumplido",
    text: [
      {
        title: "Evasivo",
      },
      {
        title: "¿QUÉ PASA AHORA?",
        description: "Cuando juegues con este personaje, roba una carta.",
      },
    ],
  },
};
