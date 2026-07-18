import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const startleI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Startle",
    text: "Chosen character gets -3 {S} this turn.",
  },
  de: {
    name: "Aufschrecken",
    text: "Ein Charakter deiner Wahl erhält in diesem Zug -3 {S}.",
  },
  fr: {
    name: "Sursaut",
    text: "Choisissez un personnage qui subit -3 {S} pour le reste de ce tour.",
  },
  it: {
    name: "Trasalire",
    text: "Un personaggio a tua scelta riceve -3 {S} per questo turno.",
  },
  es: {
    name: "Asustar",
    text: "El personaje elegido obtiene -3 {S} este turno.",
  },
};
