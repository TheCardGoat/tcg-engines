import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const healingDecanterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Healing Decanter",
    text: [
      {
        title: "RENEWING ESSENCE",
        description: "{E} — Remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Heilende Karaffe",
    text: [
      {
        title: "ERNEUERNDE ESSENZ",
        description: "— Entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Philtre de guérison",
    text: [
      {
        title: "SOLUTION",
        description: "RÉGÉNÉRANTE — Choisissez un personnage et retirez-lui jusqu'à 2 dommages.",
      },
    ],
  },
  it: {
    name: "Ampolla Curativa",
    text: [
      {
        title: "ESSENZA DI RINNOVAMENTO",
        description: "— Rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
