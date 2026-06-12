import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckStruttingHisStuffI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Strutting His Stuff",
    text: "Ward",
  },
  de: {
    name: "Donald Duck",
    version: "Stolziert umher",
    text: "Behütet",
  },
  fr: {
    name: "DONALD",
    version: "Inventeur fanfaron",
    text: "Hors d'atteinte",
  },
  it: {
    name: "Donald Duck",
    version: "Strutting His Stuff",
    text: [
      {
        title: "Ward",
        description: "(Opponents can't choose this character except to challenge.)",
      },
    ],
  },
};
