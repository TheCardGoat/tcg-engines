import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amosSladeTenaciousTrackerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amos Slade",
    version: "Tenacious Tracker",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Amos Slade",
    version: "Hartnäckiger Verfolger",
    text: [
      {
        title: "Alarmiert",
        description: "(Dieser Charakter kann herausfordern, als hätte er Wendig.)",
      },
    ],
  },
  fr: {
    name: "Amos Slade",
    version: "Pisteur tenace",
    text: "Agilité (Ce personnage peut défier comme s'il était Insaisissable.)",
  },
  it: {
    name: "Amos Slade",
    version: "Inseguitore Tenace",
    text: [
      {
        title: "Vigile",
        description: "(Questo personaggio può sfidare come se avesse Sfuggente.)",
      },
    ],
  },
};
