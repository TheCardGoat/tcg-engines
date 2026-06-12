import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaLittleSisterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "Little Sister",
    text: [
      {
        title: "UNEXPECTED DISCOVERY",
        description:
          "When you play this character, you may put a card from chosen player's discard on the bottom of their deck.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Kleine Schwester",
    text: [
      {
        title: "UNERWARTETE ENTDECKUNG",
        description:
          "Wenn du diesen Charakter ausspielst, darfst du 1 Karte aus einem Ablagestapel deiner Wahl unter das zugehörige Deck legen.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Petite sœur",
    text: [
      {
        title: "DÉCOUVERTE INATTENDUE",
        description:
          "Lorsque vous jouez ce personnage, vous pouvez choisir un joueur et placer une carte de sa défausse sous sa pioche.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Sorellina",
    text: [
      {
        title: "SCOPERTA INATTESA",
        description:
          "Quando giochi questo personaggio, puoi mettere una carta dagli scarti di un giocatore a tua scelta in fondo al suo mazzo.",
      },
    ],
  },
};
