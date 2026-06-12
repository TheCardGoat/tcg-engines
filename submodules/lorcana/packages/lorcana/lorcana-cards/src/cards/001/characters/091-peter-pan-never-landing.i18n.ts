import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const peterPanNeverLandingI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Peter Pan",
    version: "Never Landing",
    text: "Evasive",
  },
  de: {
    name: "Peter Pan",
    version: "Landet nimmer",
    text: "Wendig",
  },
  fr: {
    name: "PETER PAN",
    version: "Toujours dans les airs",
    text: "Insaisissable",
  },
  it: {
    name: "Peter Pan",
    version: "Never Landing",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
