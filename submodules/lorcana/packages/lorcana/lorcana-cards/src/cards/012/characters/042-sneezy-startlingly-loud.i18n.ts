import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const sneezyStartlinglyLoudI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Sneezy",
    version: "Startlingly Loud",
    text: [
      {
        title: "Gesundheit",
        description: "When you play this character, chosen character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Hatschi",
    version: "Erschreckend laut",
    text: [
      {
        title: "Gesundheit",
        description:
          "Wenn du diesen Charakter ausspielst, erhält ein Charakter deiner Wahl in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Atchoum",
    version: "Étonnamment bruyant",
    text: [
      {
        title: "Gesundheit",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Eolo",
    version: "Sorprendentemente Chiassoso",
    text: [
      {
        title: "Salute",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +1 {L} per questo turno.",
      },
    ],
  },
};
