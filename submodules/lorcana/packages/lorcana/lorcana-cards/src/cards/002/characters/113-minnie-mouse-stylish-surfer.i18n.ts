import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const minnieMouseStylishSurferI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Minnie Mouse",
    version: "Stylish Surfer",
    text: "Evasive",
  },
  de: {
    name: "Minnie Maus",
    version: "Stylische Surferin",
    text: "Wendig",
  },
  fr: {
    name: "Minnie",
    version: "Surfeuse élégante",
    text: "Insaisissable",
  },
  it: {
    name: "Minnie Mouse",
    version: "Stylish Surfer",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
