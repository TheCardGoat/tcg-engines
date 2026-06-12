import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rayEasygoingFireflyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ray",
    version: "Easygoing Firefly",
    text: "Evasive",
  },
  de: {
    name: "Ray",
    version: "Unbekümmertes Glühwürmchen",
    text: "Wendig",
  },
  fr: {
    name: "Ray",
    version: "Luciole décontractée",
    text: "Insaisissable",
  },
  it: {
    name: "Ray",
    version: "Easygoing Firefly",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
