import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const thumperYoungBunnyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Thumper",
    version: "Young Bunny",
    text: [
      {
        title: "YOU CAN DO IT!",
        description: "{E} — Chosen character gets +3 this turn.",
      },
    ],
  },
  de: {
    name: "Klopfer",
    version: "Junges Häschen",
    text: [
      {
        title: "Das schaffst du doch!",
        description: "{E} — Gib einem Charakter deiner Wahl in diesem Zug +3 {S}.",
      },
    ],
  },
  fr: {
    name: "Panpan",
    version: "Lapereau",
    text: [
      {
        title: "Tu peux le faire!",
        description: "{E} — Choisissez un personnage qui gagne +3 {S} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tamburino",
    version: "Giovane Coniglio",
    text: [
      {
        title: "Tu Hai le Gambe Lunghe!",
        description: "{E} — Un personaggio a tua scelta riceve +3 {S} per questo turno.",
      },
    ],
  },
};
