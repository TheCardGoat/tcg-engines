import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const percyPupsicleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Percy",
    version: "Pupsicle",
    text: [
      {
        title: "ICE BATH",
        description: "This character can't challenge.",
      },
    ],
  },
  de: {
    name: "Percy",
    version: "Kalter Hund",
    text: [
      {
        title: "EISBAD",
        description: "Dieser Charakter kann nicht herausfordern.",
      },
    ],
  },
  fr: {
    name: "Percy",
    version: "Chien givré",
    text: [
      {
        title: "BAIN DE GLACE",
        description: "Ce personnage ne peut pas défier.",
      },
    ],
  },
  it: {
    name: "Perlin",
    version: "Canghiacciolo",
    text: [
      {
        title: "BAGNO DI GHIACCIO",
        description: "Questo personaggio non può sfidare.",
      },
    ],
  },
};
