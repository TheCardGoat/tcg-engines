import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const iceBlockI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Ice Block",
    text: [
      {
        title: "CHILLY LABOR",
        description: "{E} — Chosen character gets -1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Eisklotz",
    text: [
      {
        title: "Kühles Arbeiten",
        description: "{E} — Gib einem Charakter deiner Wahl in diesem Zug -1 {S}.",
      },
    ],
  },
  fr: {
    name: "Bloc de Glace",
    text: [
      {
        title: "Travail glacial",
        description: "{E} — Choisissez un personnage qui subit -1 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Blocco di Ghiaccio",
    text: [
      {
        title: "Lavoro da Brividi",
        description: "{E} — Un personaggio a tua scelta riceve -1 {S} per questo turno.",
      },
    ],
  },
};
