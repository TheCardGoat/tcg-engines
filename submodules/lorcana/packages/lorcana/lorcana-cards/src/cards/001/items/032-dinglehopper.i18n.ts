import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dinglehopperI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dinglehopper",
    text: [
      {
        title: "STRAIGHTEN HAIR",
        description: "{E} — Remove up to 1 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Dingelhopper",
    text: [
      {
        title: "HAARE STRIEGELN",
        description: "— Entferne bis zu 1 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "ZIRGOUFLEX",
    text: [
      {
        title: "RATISSER LES POILS DE",
        description: "TÊTE — Choisissez un personnage et retirez-lui 1 jeton Dommage.",
      },
    ],
  },
  it: {
    name: "Arricciaspiccia",
    text: [
      {
        title: "SISTEMARE I CAPELLI",
        description: "— Rimuovi fino a 1 danno da un personaggio a tua scelta.",
      },
    ],
  },
};
