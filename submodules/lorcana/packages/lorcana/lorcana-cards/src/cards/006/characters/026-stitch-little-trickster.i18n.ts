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
        title: "Helfende Hand",
        description: "1 {I} — Dieser Charakter erhält in diesem Zug +1 {S}.",
      },
    ],
  },
  fr: {
    name: "Stitch",
    version: "Petit farceur",
    text: [
      {
        title: "Besoin d'un coup de main?",
        description: "1 {I} — Ce personnage gagne +1 {S} pour le reste du tour.",
      },
    ],
  },
  it: {
    name: "Stitch",
    version: "Piccolo Imbroglione",
    text: [
      {
        title: "Serve una Mano?",
        description: "1 {I} — Questo personaggio riceve +1 {S} per questo turno.",
      },
    ],
  },
  es: {
    name: "Puntada",
    version: "Pequeño embaucador",
    text: [
      {
        title: "¿NECESITAS UNA MANO? 1",
        description: "{I}: este personaje obtiene +1 {S} este turno.",
      },
    ],
  },
};
