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
    text: [
      {
        title: "Alarmiert",
        description: "(Dieser Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Cri-Kee",
    version: "Charme de chance",
    text: "Agilité (Ce personnage peut défier comme s'il avait Insaisissable.)",
  },
  it: {
    name: "Cri-Cri",
    version: "Portafortuna",
    text: [
      {
        title: "Vigile",
        description: "(Questo personaggio può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
