import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rubyChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ruby Chromicon",
    text: [
      {
        title: "RUBY LIGHT",
        description: "{E} — Chosen character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Rubin Chromikon",
    text: [
      {
        title: "Rubinfarbenes Licht",
        description: "{E} — Gib einem Charakter deiner Wahl in diesem Zug +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Chromicône de Rubis",
    text: [
      {
        title: "Lueur de rubis",
        description: "{E} — Choisissez un personnage qui gagne +1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cromicon di Rubino",
    text: [
      {
        title: "Luce di Rubino",
        description: "{E} — Un personaggio a tua scelta riceve +1 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Cromicon rubí",
    text: [
      {
        title: "LUZ RUBÍ",
        description: "{E}: el personaje elegido obtiene +1 {S} este turno.",
      },
    ],
  },
};
