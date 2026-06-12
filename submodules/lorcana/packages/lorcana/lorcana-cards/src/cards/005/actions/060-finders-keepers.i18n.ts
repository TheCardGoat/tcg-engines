import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const findersKeepersI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Finders Keepers",
    text: "Draw 3 cards.",
  },
  de: {
    name: "Wer's findet, darf's behalten",
    text: "Ziehe 3 Karten.",
  },
  fr: {
    name: "Force hypnotique",
    text: "Piochez une carte. Choisissez un personnage qui gagne Offensif +2 pour le reste de ce tour.",
  },
  it: {
    name: "Chi Trova Tiene",
    text: "Pesca 3 carte.",
  },
};
