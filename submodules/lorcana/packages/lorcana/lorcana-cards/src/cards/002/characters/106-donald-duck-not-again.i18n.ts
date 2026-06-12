import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckNotAgainI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Not Again!",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PHOOEY!",
        description: "This character gets +1 {L} for each 1 damage on him.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Nicht schon wieder!",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "ES REICHT!",
        description: "Dieser Charakter erhält für jeden Schaden auf ihm +1.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Pas encore !",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "J'EN AI ASSEZ!",
        description: "Ce personnage gagne +1 pour chaque jeton Dommage sur lui.",
      },
    ],
  },
  it: {
    name: "Donald Duck",
    version: "Not Again!",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "PHOOEY!",
        description: "This character gets +1 for each 1 damage on him.",
      },
    ],
  },
};
