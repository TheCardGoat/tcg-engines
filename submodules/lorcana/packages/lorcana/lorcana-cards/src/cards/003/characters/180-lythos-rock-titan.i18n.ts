import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const lythosRockTitanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Lythos",
    version: "Rock Titan",
    text: [
      {
        title: "Resist +2",
      },
      {
        title: "STONE SKIN",
        description: "{E} — Chosen character gains Resist +2 this turn.",
      },
    ],
  },
  de: {
    name: "Granitos",
    version: "Stein Titan",
    text: [
      {
        title: "Robust +2",
      },
      {
        title: "STEINHAUT",
        description: "— Ein Charakter deiner Wahl erhält in diesem Zuges Robust +2.",
      },
    ],
  },
  fr: {
    name: "Lythos",
    version: "Titan de pierre",
    text: [
      {
        title: "Résistance +2",
      },
      {
        title: "PEAU DE PIERRE",
        description: "— Choisissez un personnage, il gagne Résistance +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lythos",
    version: "Titano di Roccia",
    text: [
      {
        title: "Resistere +2",
      },
      {
        title: "PELLE DI PIETRA",
        description: "— Un personaggio a tua scelta ottiene Resistere +2 per questo turno.",
      },
    ],
  },
};
