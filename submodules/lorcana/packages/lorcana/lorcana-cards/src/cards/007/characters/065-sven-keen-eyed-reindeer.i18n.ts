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
        title: "Rasant",
      },
      {
        title: "AUSSERORDENTLICH SCHARFER BLICK",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug -3.",
      },
    ],
  },
  fr: {
    name: "Sven",
    version: "Renne aux aguets",
    text: [
      {
        title: "Charge",
      },
      {
        title: "REGARD REDOUTABLE",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui subit -3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Sven",
    version: "Renna dallo Sguardo Acuto",
    text: [
      {
        title: "Lesto",
      },
      {
        title: "OCCHIATACCIA FORMIDABILE",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve -3 per questo turno.",
      },
    ],
  },
};
