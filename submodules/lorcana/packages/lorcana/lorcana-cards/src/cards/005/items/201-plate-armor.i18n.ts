import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plateArmorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Plate Armor",
    text: [
      {
        title: "WELL CRAFTED",
        description: "{E} — Chosen character gains Resist +2 until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Plattenrüstung",
    text: [
      {
        title: "GUTE HANDWERKSKUNST",
        description:
          "— Ein Charakter deiner Wahl erhält bis zu Beginn deines nächsten Zuges Robust +2. (Reduziere jeglichen Schaden, der dem Charakter zugefügt wird, um 2.)",
      },
    ],
  },
  fr: {
    name: "Armure de plaques",
    text: [
      {
        title: "D'EXCELLENTE FACTURE",
        description:
          "— Choisissez un personnage qui gagne Résistance +2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Armatura a Piastre",
    text: [
      {
        title: "BEN FATTA",
        description:
          "— Un personaggio a tua scelta ottiene Resistere +2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
