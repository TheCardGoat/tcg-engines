import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const launchpadSkyPatrolI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Launchpad",
    version: "Sky Patrol",
    text: [
      {
        title: "Alert",
        description: "(This character can challenge as if they had Evasive.)",
      },
    ],
  },
  de: {
    name: "Quack, der Bruchpilot",
    version: "Himmelspatrouille",
    text: "<Alarmiert> (Dieser Charakter kann herausfordern, als hätte er Wendig.)",
  },
  fr: {
    name: "Flagada Jones",
    version: "Patrouilleur du ciel",
    text: "<Agilité> (Ce personnage peut défier comme s'il avait Insaisissable.)",
  },
  it: {
    name: "Jet",
    version: "Pattuglia del Cielo",
    text: "<Vigile> (Questo personaggio può sfidare come se avesse Sfuggente.)",
  },
  es: {
    name: "Plataforma de lanzamiento",
    version: "Patrulla del cielo",
    text: [
      {
        title: "Alerta",
        description: "(Este personaje puede desafiar como si tuviera Evasivo).",
      },
    ],
  },
};
