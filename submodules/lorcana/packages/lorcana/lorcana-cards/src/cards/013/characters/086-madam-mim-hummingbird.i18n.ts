import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const madamMimHummingbirdI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Madam Mim",
    version: "Hummingbird",
    text: [
      {
        title: "<Evasive>",
      },
      {
        title: "Just How I Like It",
        description: "All cards in your hand count as having {C}.",
      },
    ],
  },
  de: {
    name: "Madame Mim",
    version: "Kolibri",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Genau wie ich es mag",
        description: "Alle Karten in deiner Hand zählen als {C}.",
      },
    ],
  },
  fr: {
    name: "Madame Mime",
    version: "En colibri",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Juste comme je les aime",
        description: "Toutes les cartes de votre main sont considérées comme ayant {C}.",
      },
    ],
  },
  it: {
    name: "Maga Magò",
    version: "Colibrì",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Proprio Come Piace a Me",
        description: "Tutte le carte nella tua mano contano come se avessero {C}.",
      },
    ],
  },
};
