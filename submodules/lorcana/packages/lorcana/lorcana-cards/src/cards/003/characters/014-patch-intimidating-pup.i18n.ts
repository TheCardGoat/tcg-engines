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
        title: "Bellen",
        description:
          "{E} — Gib einem Charakter deiner Wahl bis zu Beginn deines nächsten Zuges -2 {S}.",
      },
    ],
  },
  fr: {
    name: "Patch",
    version: "Chiot intimidant",
    text: [
      {
        title: "Aboiement",
        description:
          "{E} — Choisissez un personnage qui subit -2 {S} jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Macchia",
    version: "Piccolo Minaccioso",
    text: [
      {
        title: "Abbaiare",
        description:
          "{E} — Un personaggio a tua scelta riceve -2 {S} fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
  es: {
    name: "Parche",
    version: "Cachorro intimidante",
    text: [
      {
        title: "LADRAR",
        description:
          "{E}: el personaje elegido obtiene -2 {S} hasta el comienzo de tu siguiente turno.",
      },
    ],
  },
};
