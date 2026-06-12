import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const patchIntimidatingPupI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Patch",
    version: "Intimidating Pup",
    text: [
      {
        title: "BARK",
        description: "{E} — Chosen character gets -2 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Patch",
    version: "Einschüchternder Welpe",
    text: [
      {
        title: "BELLEN",
        description: "— Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2.",
      },
    ],
  },
  fr: {
    name: "Patch",
    version: "Chiot intimidant",
    text: [
      {
        title: "ABOIEMENT",
        description:
          "— Choisissez un personnage qui subit -2 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Macchia",
    version: "Piccolo Minaccioso",
    text: [
      {
        title: "ABBAIARE",
        description:
          "— Un personaggio a tua scelta riceve -2 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
