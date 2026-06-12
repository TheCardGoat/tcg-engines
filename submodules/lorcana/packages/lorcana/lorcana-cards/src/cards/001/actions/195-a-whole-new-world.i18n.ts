import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aWholeNewWorldI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "A Whole New World",
    text: "Each player discards their hand and draws 7 cards.",
  },
  de: {
    name: "A Whole New World",
    text: [
      {
        title: "(A",
        description:
          "character with cost 5 or more can to sing this song for free.) Each player discards their hand and draws 7 cards.",
      },
    ],
  },
  fr: {
    name: "A Whole New World",
    text: [
      {
        title: "(A",
        description:
          "character with cost 5 or more can to sing this song for free.) Each player discards their hand and draws 7 cards.",
      },
    ],
  },
  it: {
    name: "A Whole New World",
    text: "Each player discards their hand and draws 7 cards.",
  },
};
