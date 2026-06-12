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
        title: "DAS SCHAFFST DU DOCH!",
        description: "— Gib einem Charakter deiner Wahl in diesem Zug +3.",
      },
    ],
  },
  fr: {
    name: "Panpan",
    version: "Lapereau",
    text: [
      {
        title: "TU PEUX LE FAIRE!",
        description: "— Choisissez un personnage qui gagne +3 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tamburino",
    version: "Giovane Coniglio",
    text: [
      {
        title: "TU HAI LE GAMBE LUNGHE!",
        description: "— Un personaggio a tua scelta riceve +3 per questo turno.",
      },
    ],
  },
};
