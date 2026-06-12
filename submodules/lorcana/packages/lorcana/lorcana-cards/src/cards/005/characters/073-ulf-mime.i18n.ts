import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const ulfMimeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ulf",
    version: "Mime",
    text: [
      {
        title: "SILENT PERFORMANCE",
        description: "This character can't {E} to sing songs.",
      },
    ],
  },
  de: {
    name: "Ulf",
    version: "Pantomime",
    text: [
      {
        title: "STUMME DARSTELLUNG",
        description: "Dieser Charakter kann nicht, um Lieder zu singen.",
      },
    ],
  },
  fr: {
    name: "Ulf",
    version: "Mime",
    text: [
      {
        title: "NUMÉRO SILENCIEUX",
        description: "Ce personnage ne peut pas être pour chanter des chansons.",
      },
    ],
  },
  it: {
    name: "Ulf",
    version: "Mimo",
    text: [
      {
        title: "PERFORMANCE SILENZIOSA",
        description: "Questo personaggio non può per cantare le canzoni.",
      },
    ],
  },
};
