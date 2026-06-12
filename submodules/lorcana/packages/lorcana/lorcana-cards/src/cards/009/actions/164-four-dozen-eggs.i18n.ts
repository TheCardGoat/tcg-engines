import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fourDozenEggsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Four Dozen Eggs",
    text: "Your characters gain Resist +2 until the start of your next turn.",
  },
  de: {
    name: "Four Dozen Eggs",
    text: [
      {
        title: "(A",
        description:
          "character with cost 4 or more can to sing this song for free.) Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
      },
    ],
  },
  fr: {
    name: "Four Dozen Eggs",
    text: [
      {
        title: "(A",
        description:
          "character with cost 4 or more can to sing this song for free.) Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
      },
    ],
  },
  it: {
    name: "Four Dozen Eggs",
    text: "Your characters gain Resist +2 until the start of your next turn. (Damage dealt to them is reduced by 2.)",
  },
};
