import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lefouBumblerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "LeFou",
    version: "Bumbler",
    text: [
      {
        title: "LOYAL",
        description:
          "If you have a character named Gaston in play, you pay 1 {I} less to play this character.",
      },
    ],
  },
  de: {
    name: "Le Fou",
    version: "Tollpatsch",
    text: [
      {
        title: "LOYAL",
        description:
          "Wenn du einen Gaston-Charakter im Spiel hast, zahlst du 1 weniger, um diesen Charakter auszuspielen.",
      },
    ],
  },
  fr: {
    name: "LE FOU",
    version: "Empoté",
    text: [
      {
        title: "LOYAL",
        description:
          "Si vous avez un personnage Gaston en jeu, jouer ce personnage coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "LeFou",
    version: "Bumbler",
    text: [
      {
        title: "LOYAL",
        description:
          "If you have a character named Gaston in play, you pay 1 less to play this character.",
      },
    ],
  },
};
