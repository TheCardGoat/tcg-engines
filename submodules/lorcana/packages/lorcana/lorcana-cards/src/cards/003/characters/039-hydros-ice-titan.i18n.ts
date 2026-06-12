import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hydrosIceTitanI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hydros",
    version: "Ice Titan",
    text: [
      {
        title: "BLIZZARD",
        description: "{E} — Exert chosen character.",
      },
    ],
  },
  de: {
    name: "Polaros",
    version: "Eis Titan",
    text: [
      {
        title: "BLIZZARD",
        description: "— Erschöpfe einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Hydros",
    version: "Titan de glace",
    text: [
      {
        title: "BLIZZARD",
        description: "— Choisissez un personnage et épuisez-le.",
      },
    ],
  },
  it: {
    name: "Hydros",
    version: "Titano di Ghiaccio",
    text: [
      {
        title: "TORMENTA",
        description: "— Impegna un personaggio a tua scelta.",
      },
    ],
  },
};
