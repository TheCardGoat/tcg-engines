import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const arielSingingMermaidI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ariel",
    version: "Singing Mermaid",
    text: "Singer 7",
  },
  de: {
    name: "Arielle",
    version: "Singende Meerjungfrau",
    text: [
      {
        title: "Singen 7",
        description: "(Die Kosten dieses Charakters gelten als 7 für das Singen von Liedern.)",
      },
    ],
  },
  fr: {
    name: "Ariel",
    version: "Sirène chantante",
    text: "Mélomane 7 (Ce personnage est considéré comme ayant un coût de 7 pour chanter des chansons.)",
  },
  it: {
    name: "Ariel",
    version: "Sirena Canterina",
    text: "Melodioso 7",
  },
};
