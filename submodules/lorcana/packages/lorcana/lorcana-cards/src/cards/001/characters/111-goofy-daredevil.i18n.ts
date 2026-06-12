import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyDaredevilI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Daredevil",
    text: "Evasive",
  },
  de: {
    name: "Goofy",
    version: "Draufgänger",
    text: "Wendig",
  },
  fr: {
    name: "DINGO",
    version: "Tête brulée",
    text: "Insaisissable",
  },
  it: {
    name: "Goofy",
    version: "Daredevil",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
