import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const svenKeeneyedReindeerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sven",
    version: "Keen-Eyed Reindeer",
    text: [
      {
        title: "Rush",
      },
      {
        title: "FORMIDABLE GLARE",
        description: "When you play this character, chosen character gets -3 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Sven",
    version: "Scharfsichtiges Rentier",
    text: [
      {
        title: "<Rasant>",
      },
      {
        title: "Außerordentlich scharfer Blick",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug -3 {S}.",
      },
    ],
  },
  fr: {
    name: "Sven",
    version: "Renne aux aguets",
    text: [
      {
        title: "<Charge>",
      },
      {
        title: "Regard redoutable",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui subit -3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Sven",
    version: "Renna dallo Sguardo Acuto",
    text: [
      {
        title: "<Lesto> (Questo personaggio può sfidare nel turno in cui è stato giocato.)",
      },
      {
        title: "Occhiataccia Formidabile",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve -3 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Sven",
    version: "Reno de ojos agudos",
    text: [
      {
        title: "Correr",
      },
      {
        title: "BRILLO FORMIDABLE",
        description:
          "Cuando juegas con este personaje, el personaje elegido obtiene -3 {S} este turno.",
      },
    ],
  },
};
