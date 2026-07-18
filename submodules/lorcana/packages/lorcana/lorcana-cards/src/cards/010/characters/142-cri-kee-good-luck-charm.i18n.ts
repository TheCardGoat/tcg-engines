import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const crikeeGoodLuckCharmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Cri-Kee",
    version: "Good Luck Charm",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Kriki",
    version: "Glücksbringer",
    text: "<Alarmiert> (Dieser Charakter kann herausfordern, als hätte er Wendig.)",
  },
  fr: {
    name: "Cri-Kee",
    version: "Charme de chance",
    text: "<Agilité> (Ce personnage peut défier comme s'il avait Insaisissable.)",
  },
  it: {
    name: "Cri-Cri",
    version: "Portafortuna",
    text: "<Vigile> (Questo personaggio può sfidare come se avesse Sfuggente.)",
  },
  es: {
    name: "Cri-kee",
    version: "Amuleto de buena suerte",
    text: [
      {
        title: "Alerta",
        description: "(Este personaje puede desafiar como si tuviera Evasivo).",
      },
    ],
  },
};
