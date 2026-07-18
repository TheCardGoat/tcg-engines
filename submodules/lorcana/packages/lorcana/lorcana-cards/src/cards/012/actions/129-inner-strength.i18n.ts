import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const innerStrengthI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Inner Strength",
    text: "Chosen character gets +1 {S} this turn. Draw a card.",
  },
  de: {
    name: "Innere Stärke",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug +1 {S}. Ziehe 1 Karte.",
  },
  fr: {
    name: "Force intérieure",
    text: "Choisissez un personnage qui gagne +1 {S} pour le reste de ce tour. Piochez une carte.",
  },
  it: {
    name: "Forza Interiore",
    text: "Un personaggio a tua scelta riceve +1 {S} per questo turno. Pesca una carta.",
  },
  es: {
    name: "Fuerza interior",
    text: "El personaje elegido obtiene +1 {S} este turno. Saca una carta.",
  },
};
