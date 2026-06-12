import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const fidgetRatigansHenchmanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Fidget",
    version: "Ratigan's Henchman",
    text: "Evasive",
  },
  de: {
    name: "Greifer",
    version: "Rattenzahns Handlanger",
    text: "Wendig",
  },
  fr: {
    name: "Fidget",
    version: "Homme de main de Ratigan",
    text: "Insaisissable",
  },
  it: {
    name: "Fidget",
    version: "Ratigan's Henchman",
    text: [
      {
        title: "Evasive",
        description: "(Only characters with Evasive can challenge this character.)",
      },
    ],
  },
};
