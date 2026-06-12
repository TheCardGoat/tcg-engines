import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ratiganCriminalMastermindI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ratigan",
    version: "Criminal Mastermind",
    text: "Evasive",
  },
  de: {
    name: "Rattenzahn",
    version: "Kriminelles Genie",
    text: "Wendig",
  },
  fr: {
    name: "Ratigan",
    version: "Génie du crime",
    text: "Insaisissable",
  },
  it: {
    name: "Ratigan",
    version: "Criminal Mastermind",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
