import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const simbaAdventurousSuccessorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Simba",
    version: "Adventurous Successor",
    text: [
      {
        title: "I LAUGH IN THE FACE OF DANGER",
        description: "When you play this character, chosen character gets +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Simba",
    version: "Abenteuerlustiger Nachwuchs",
    text: [
      {
        title: "ICH LACHE DIR INS GESICHT",
        description:
          "Wenn du diesen Charakter ausspielst, gib einem Charakter deiner Wahl in diesem Zug +2.",
      },
    ],
  },
  fr: {
    name: "Simba",
    version: "Successeur aventureux",
    text: [
      {
        title: "JE ME RIS DU DANGER",
        description:
          "Lorsque vous jouez ce personnage, choisissez un personnage qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Simba",
    version: "Successore Avventuroso",
    text: [
      {
        title: "IO RIDO IN FACCIA AL PERICOLO",
        description:
          "Quando giochi questo personaggio, un personaggio a tua scelta riceve +2 per questo turno.",
      },
    ],
  },
};
