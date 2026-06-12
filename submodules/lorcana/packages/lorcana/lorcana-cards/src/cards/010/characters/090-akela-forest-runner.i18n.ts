import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const akelaForestRunnerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Akela",
    version: "Forest Runner",
    text: [
      {
        title: "AHEAD OF THE PACK 1",
        description: "{I} — This character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Akela",
    version: "Waldläufer",
    text: [
      {
        title: "DEM RUDEL VORAUS 1",
        description: "— Dieser Charakter erhält in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Akela",
    version: "Court dans la forêt",
    text: [
      {
        title: "À L'AVANT DE LA MEUTE",
        description: "1 — Ce personnage gagne +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Akela",
    version: "Corridore Silvano",
    text: [
      {
        title: "DAVANTI AL BRANCO 1",
        description: "— Questo personaggio riceve +1 per questo turno.",
      },
    ],
  },
};
