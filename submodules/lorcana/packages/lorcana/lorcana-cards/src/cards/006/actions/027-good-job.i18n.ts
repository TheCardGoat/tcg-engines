import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goodJobI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Good Job!",
    text: "Chosen character gets +1 {L} this turn.",
  },
  de: {
    name: "Gut gemacht!",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +1.",
  },
  fr: {
    name: "Beau travail !",
    text: "Choisissez un personnage qui gagne +1 pour le reste de ce tour.",
  },
  it: {
    name: "Ben fatto!",
    text: "Un personaggio a tua scelta riceve +1 per questo turno.",
  },
};
