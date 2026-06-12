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
        title: "DAS BUCH WEISS ALLES, 1,",
        description: "Verbanne diesen Gegenstand — Ziehe 2 Karten.",
      },
    ],
  },
  fr: {
    name: "Le Manuel des Castors Juniors",
    text: [
      {
        title: "CE MANUEL SAIT ABSOLUMENT TOUT, 1,",
        description: "Bannissez cet objet — Piochez 2 cartes.",
      },
    ],
  },
  it: {
    name: "Manuale delle Giovani Marmotte",
    text: [
      {
        title: "IL MANUALE SA SEMPRE TUTTO, 1,",
        description: "esilia questo oggetto — Pesca 2 carte.",
      },
    ],
  },
};
