import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const napoleonPatientWatchdogI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Napoleon",
    version: "Patient Watchdog",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Napoleon",
    version: "Geduldiger Wachhund",
    text: "<Alarmiert> (Dieser Charakter kann herausfordern, als hätte er Wendig.)",
  },
  fr: {
    name: "Napoléon",
    version: "Chien de garde patient",
    text: "<Agilité> (Ce personnage peut défier comme s'il était Insaisissable.)",
  },
  it: {
    name: "Napoleone",
    version: "Cane da Guardia Paziente",
    text: "<Vigile> (Questo personaggio può sfidare come se avesse Sfuggente.)",
  },
  es: {
    name: "Napoleon",
    version: "Patient Watchdog",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
};
