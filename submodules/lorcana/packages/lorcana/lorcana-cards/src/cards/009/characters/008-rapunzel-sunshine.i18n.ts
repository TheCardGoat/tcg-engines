import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const rapunzelSunshineI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Rapunzel",
    version: "Sunshine",
    text: [
      {
        title: "MAGIC HAIR",
        description: "{E} — Remove up to 2 damage from chosen character.",
      },
    ],
  },
  de: {
    name: "Rapunzel",
    version: "Sonnenschein",
    text: [
      {
        title: "ZAUBERHAARE",
        description: "— Entferne bis zu 2 Schaden von einem Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Raiponce",
    version: "Solaire",
    text: [
      {
        title: "CHEVEUX MAGIQUES",
        description: "— Choisissez un personnage et retirez-lui jusqu'à 2 jetons Dommage.",
      },
    ],
  },
  it: {
    name: "Rapunzel",
    version: "Raggio di Sole",
    text: [
      {
        title: "CAPELLI MAGICI",
        description: "— Rimuovi fino a 2 danni da un personaggio a tua scelta.",
      },
    ],
  },
};
