import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dugGoodBoyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dug",
    version: "Good Boy",
    text: [
      {
        title: "Fetch!",
        description: "When you play this character, if you have an item in play, draw a card.",
      },
    ],
  },
  de: {
    name: "Dug",
    version: "Guter Junge",
    text: [
      {
        title: "Hol's!",
        description:
          "Wenn du diesen Charakter ausspielst, falls du mindestens einen Gegenstand im Spiel hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Doug",
    version: "Un bon chien",
    text: [
      {
        title: "Va chercher!",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un objet en jeu, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Dug",
    version: "Bravo Cagnolino",
    text: [
      {
        title: "Prendila!",
        description:
          "Quando giochi questo personaggio, se hai in gioco un oggetto, pesca una carta.",
      },
    ],
  },
};
