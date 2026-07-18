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
        title: "Stumme Darstellung",
        description: "Dieser Charakter kann nicht {E}, um Lieder zu singen.",
      },
    ],
  },
  fr: {
    name: "Ulf",
    version: "Mime",
    text: [
      {
        title: "Numéro silencieux",
        description: "Ce personnage ne peut pas être {E} pour chanter des chansons.",
      },
    ],
  },
  it: {
    name: "Ulf",
    version: "Mimo",
    text: [
      {
        title: "Performance Silenziosa",
        description: "Questo personaggio non può {E} per cantare le canzoni.",
      },
    ],
  },
  es: {
    name: "Ulf",
    version: "Mímica",
    text: [
      {
        title: "RENDIMIENTO SILENCIOSO",
        description: "Este personaje no puede {E} cantar canciones.",
      },
    ],
  },
};
