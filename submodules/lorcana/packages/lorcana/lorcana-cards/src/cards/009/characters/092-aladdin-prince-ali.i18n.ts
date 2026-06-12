import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const aladdinPrinceAliI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Aladdin",
    version: "Prince Ali",
    text: "Ward",
  },
  de: {
    name: "Aladdin",
    version: "Prinz Ali",
    text: "Behütet",
  },
  fr: {
    name: "Aladdin",
    version: "Prince Ali",
    text: "Hors d'atteinte",
  },
  it: {
    name: "Aladdin",
    version: "Prince Ali",
    text: [
      {
        title: "Ward",
        description: "(Opponents can't choose this character except to challenge.)",
      },
    ],
  },
};
