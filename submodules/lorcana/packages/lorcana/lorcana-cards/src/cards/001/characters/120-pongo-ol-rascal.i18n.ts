import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const pongoOlRascalI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Pongo",
    version: "Ol’ Rascal",
    text: "Evasive",
  },
  de: {
    name: "Pongo",
    version: "Alter Gauner",
    text: "Wendig",
  },
  fr: {
    name: "PONGO",
    version: "Sacripant",
    text: "Insaisissable",
  },
  it: {
    name: "Pongo",
    version: "Ol’ Rascal",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
