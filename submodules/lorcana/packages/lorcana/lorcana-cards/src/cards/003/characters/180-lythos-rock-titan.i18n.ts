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
        title:
          "<Robust> +2 (Reduziere jeglichen Schaden, der diesem Charakter zugefügt wird, um 2.)",
      },
      {
        title: "Steinhaut",
        description: "{E} — Ein Charakter deiner Wahl erhält in diesem Zuges <Robust> +2.",
      },
    ],
  },
  fr: {
    name: "Lythos",
    version: "Titan de pierre",
    text: [
      {
        title: "<Résistance> +2",
      },
      {
        title: "Peau de pierre",
        description:
          "{E} — Choisissez un personnage, il gagne <Résistance> +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Lythos",
    version: "Titano di Roccia",
    text: [
      {
        title: "<Resistere> +2",
      },
      {
        title: "Pelle di Pietra",
        description: "{E} — Un personaggio a tua scelta ottiene <Resistere> +2 per questo turno.",
      },
    ],
  },
  es: {
    name: "Litos",
    version: "Titán de roca",
    text: [
      {
        title: "Resistir +2",
      },
      {
        title: "PIEL DE PIEDRA",
        description: "{E}: el personaje elegido obtiene Resistencia +2 este turno.",
      },
    ],
  },
};
