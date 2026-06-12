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
        title: "KÜHLES ARBEITEN",
        description: "— Gib einem Charakter deiner Wahl in diesem Zug -1.",
      },
    ],
  },
  fr: {
    name: "Bloc de Glace",
    text: [
      {
        title: "TRAVAIL GLACIAL",
        description: "— Choisissez un personnage qui subit -1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Blocco di Ghiaccio",
    text: [
      {
        title: "LAVORO DA BRIVIDI",
        description: "— Un personaggio a tua scelta riceve -1 per questo turno.",
      },
    ],
  },
};
