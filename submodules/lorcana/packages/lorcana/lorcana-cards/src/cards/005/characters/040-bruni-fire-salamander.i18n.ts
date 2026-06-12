import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const bruniFireSalamanderI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Bruni",
    version: "Fire Salamander",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PARTING GIFT",
        description: "When this character is banished, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Bruni",
    version: "Feuersalamander",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "ABSCHIEDSGESCHENK",
        description: "Wenn dieser Charakter verbannt wird, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Bruni",
    version: "Salamandre de feu",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "UN CADEAU AU PASSAGE",
        description: "Lorsque ce personnage est banni, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Bruni",
    version: "Salamandra del Fuoco",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "DONO DI ADDIO",
        description: "Quando questo personaggio viene esiliato, puoi pescare una carta.",
      },
    ],
  },
};
