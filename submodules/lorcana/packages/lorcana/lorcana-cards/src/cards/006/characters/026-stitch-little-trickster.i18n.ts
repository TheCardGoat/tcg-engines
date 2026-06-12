import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const stitchLittleTricksterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Stitch",
    version: "Little Trickster",
    text: [
      {
        title: "NEED A HAND? 1",
        description: "{I} — This character gets +1 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Stitch",
    version: "Kleiner Scherzbold",
    text: [
      {
        title: "HELFENDE HAND 1",
        description: "— Dieser Charakter erhält in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Petit farceur",
    text: [
      {
        title: "BESOIN D'UN COUP DE MAIN? 1",
        description: "— Ce personnage gagne +1 pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Piccolo Imbroglione",
    text: [
      {
        title: "SERVE UNA MANO? 1",
        description: "— Questo personaggio riceve +1 per questo turno.",
      },
    ],
  },
};
