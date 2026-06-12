import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const kidaGuardianOfThePathI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Kida",
    version: "Guardian of the Path",
    text: [
      {
        title: "Natural Defense",
        description:
          "When you play this character, chosen opposing character gets -2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Kida",
    version: "Wächterin des Pfades",
    text: [
      {
        title: "Natürliche Abwehrkräfte",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein gegnerischer Charakter deiner Wahl in diesem Zug -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Kida",
    version: "Gardienne du passage",
    text: [
      {
        title: "Défense naturelle",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage adverse qui subit -2 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Kida",
    version: "Guardiana del Sentiero",
    text: [
      {
        title: "Difesa Naturale",
        description:
          "Quando giochi questo personaggio, un personaggio avversario a tua scelta riceve -2 {S} per questo turno.",
      },
    ],
  },
};
