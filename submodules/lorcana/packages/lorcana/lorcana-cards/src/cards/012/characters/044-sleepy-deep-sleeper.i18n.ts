import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sleepyDeepSleeperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sleepy",
    version: "Deep Sleeper",
    text: [
      {
        title: "Pleasant Dreams",
        description:
          "When this character is banished, if you have a Seven Dwarfs or Princess character in play, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Schlafmütz",
    version: "Tiefschläfer",
    text: [
      {
        title: "Angenehme Träume",
        description:
          "Wenn dieser Charakter verbannt wird, falls du mindestens einen der Sieben Zwerge oder eine Prinzessin im Spiel hast, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Dormeur",
    version: "Dans un profond sommeil",
    text: [
      {
        title: "De beaux rêves",
        description:
          "Lorsque ce personnage est banni, si vous avez un personnage Sept Nains ou Princesse en jeu, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pisolo",
    version: "Profondamente Addormentato",
    text: [
      {
        title: "Sogni d'Oro",
        description:
          "Quando questo personaggio viene esiliato, se hai in gioco un personaggio Sette Nani o Principessa, puoi pescare una carta.",
      },
    ],
  },
};
