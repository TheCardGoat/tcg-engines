import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const distractI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Distract",
    text: "Chosen character gets -2 {S} this turn. Draw a card.",
  },
  de: {
    name: "Ablenken",
    text: "Gib einem Charakter deiner Wahl in diesem Zug -2. Ziehe 1 Karte.",
  },
  fr: {
    name: "Distraction",
    text: "Choisissez un personnage, il subit -2 pour le reste de ce tour. Piochez une carte.",
  },
  it: {
    name: "Distrarre",
    text: "Un personaggio a tua scelta riceve -2 per questo turno. Pesca una carta.",
  },
};
