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
        title: "RUBINFARBENES LICHT",
        description: "— Gib einem Charakter deiner Wahl in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Chromicône de Rubis",
    text: [
      {
        title: "LUEUR DE RUBIS",
        description: "— Choisissez un personnage qui gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Cromicon di Rubino",
    text: [
      {
        title: "LUCE DI RUBINO",
        description: "— Un personaggio a tua scelta riceve +1 per questo turno.",
      },
    ],
  },
};
