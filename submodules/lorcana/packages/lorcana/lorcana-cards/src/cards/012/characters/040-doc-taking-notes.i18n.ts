import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const docTakingNotesI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Doc",
    version: "Taking Notes",
    text: [
      {
        title: "Share Knowledge",
        description:
          "When you play this character, if you have another Seven Dwarfs character or a Princess character in play, draw a card.",
      },
    ],
  },
  de: {
    name: "Chef",
    version: "Macht Notizen",
    text: [
      {
        title: "Kenntnisse teilen",
        description:
          "Wenn du diesen Charakter ausspielst und mindestens einen weiteren der Sieben Zwerge oder eine Prinzessin im Spiel hast, ziehe 1 Karte.",
      },
    ],
  },
  fr: {
    name: "Prof",
    version: "Prend des notes",
    text: [
      {
        title: "Partager ses connaissances",
        description:
          "Lorsque vous jouez ce personnage, si vous avez un autre personnage Sept Nains ou Princesse en jeu, piochez une carte.",
      },
    ],
  },
  it: {
    name: "Dotto",
    version: "Interessato",
    text: [
      {
        title: "Diffondere la Conoscenza",
        description:
          "Quando giochi questo personaggio, se hai in gioco un altro personaggio Sette Nani o un personaggio Principessa, pesca una carta.",
      },
    ],
  },
};
