import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const improviseI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Improvise",
    text: "Chosen character gets +1 {S} this turn. Draw a card.",
  },
  de: {
    name: "Improvisieren",
    text: "Gib einem Charakter deiner Wahl in diesem Zug +1. Ziehe 1 Karte.",
  },
  fr: {
    name: "Improviser",
    text: "Choisissez un personnage, il gagne +1 pour le reste de ce tour. Piochez une carte.",
  },
  it: {
    name: "Improvvisare",
    text: "Un personaggio a tua scelta riceve +1 per questo turno. Pesca una carta.",
  },
};
