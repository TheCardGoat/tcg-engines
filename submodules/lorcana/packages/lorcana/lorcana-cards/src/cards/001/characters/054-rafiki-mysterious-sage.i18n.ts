import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rafikiMysteriousSageI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rafiki",
    version: "Mysterious Sage",
    text: "Rush",
  },
  de: {
    name: "Rafiki",
    version: "Geheimnisvoller Weiser",
    text: "Rasant",
  },
  fr: {
    name: "RAFIKI",
    version: "Mystérieux sage",
    text: "Charge",
  },
  it: {
    name: "Rafiki",
    version: "Mysterious Sage",
    text: [
      {
        title: "Rush",
        description: "(This character can challenge the turn they're played.)",
      },
    ],
  },
};
