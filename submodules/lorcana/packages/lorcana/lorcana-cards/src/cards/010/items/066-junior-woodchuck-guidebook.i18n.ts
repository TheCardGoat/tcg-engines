import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const juniorWoodchuckGuidebookI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Junior Woodchuck Guidebook",
    text: [
      {
        title: "THE BOOK KNOWS EVERYTHING",
        description: "{E}, 1 {I}, Banish this item — Draw 2 cards.",
      },
    ],
  },
  de: {
    name: "Das schlaue Buch",
    text: [
      {
        title: "Das Buch weiß alles",
        description: "{E}, 1 {I}, Verbanne diesen Gegenstand — Ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Le Manuel des Castors Juniors",
    text: [
      {
        title: "Ce manuel sait absolument tout",
        description: "{E}, 1 {I}, Bannissez cet objet — Piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "Manuale delle Giovani Marmotte",
    text: [
      {
        title: "Il Manuale sa Sempre Tutto",
        description: "{E}, 1 {I}, esilia questo oggetto — Pesca 2 carte.",
      },
    ],
  },
};
