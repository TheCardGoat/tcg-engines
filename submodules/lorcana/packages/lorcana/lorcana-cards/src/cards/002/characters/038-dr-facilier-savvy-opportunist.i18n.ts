import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const drFacilierSavvyOpportunistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dr. Facilier",
    version: "Savvy Opportunist",
    text: "Evasive",
  },
  de: {
    name: "Dr. Facilier",
    version: "Gerissener Opportunist",
    text: "Wendig",
  },
  fr: {
    name: "Dr. Facilier",
    version: "Opportuniste bien renseigné",
    text: "Insaisissable",
  },
  it: {
    name: "Dr. Facilier",
    version: "Savvy Opportunist",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
