import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const snowWhiteFairestInTheLandI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Snow White",
    version: "Fairest in the Land",
    text: [
      {
        title: "HIDDEN AWAY",
        description: "This character can't be challenged.",
      },
    ],
  },
  de: {
    name: "Schneewittchen",
    version: "Die Schönste im Land",
    text: [
      {
        title: "VERSTECKT",
        description: "Dieser Charakter kann nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Blanche-Neige",
    version: "Plus belle que jamais",
    text: [
      {
        title: "DISSIMULÉE",
        description: "Ce personnage ne peut pas être défié.",
      },
    ],
  },
  it: {
    name: "Biancaneve",
    version: "La Più Bella del Reame",
    text: [
      {
        title: "NASCOSTA",
        description: "Questo personaggio non può essere sfidato.",
      },
    ],
  },
};
