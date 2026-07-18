import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const magicGoldenFlowerI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Magic Golden Flower",
    text: [
      {
        title: "HEALING POLLEN",
        description: "Banish this item — Remove up to 3 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Magische Goldene Blume",
    text: [
      {
        title: "Heilender Blütenstaub",
        description:
          "Verbanne diesen Gegenstand — entferne bis zu 3 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "FLEUR AUX PÉTALES D'OR",
    text: [
      {
        title: "POLLEN GUÉRISSEUR",
        description:
          "Bannissez cet objet — Choisissez un personnage et retirez-lui jusqu'à 3 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Magic Golden Flower",
    text: [
      {
        title: "Healing Pollen",
        description: "Banish this item — Remove up to 3 damage from chosen character.",
      },
    ],
  },
  es: {
    name: "Flor Dorada Mágica",
    text: [
      {
        title: "POLEN CURATIVO",
        description: "Desterrar este objeto: elimina hasta 3 daños del personaje elegido.",
      },
    ],
  },
};
