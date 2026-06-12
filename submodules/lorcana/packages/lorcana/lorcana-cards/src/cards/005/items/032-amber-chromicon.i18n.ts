import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const amberChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Amber Chromicon",
    text: [
      {
        title: "AMBER LIGHT",
        description: "{E} — Remove up to 1 damage from each of your characters.",
      },
    ],
  },
  de: {
    name: "Bernstein Chromikon",
    text: [
      {
        title: "BERNSTEINFARBENES LICHT",
        description: "— Entferne bis zu 1 Schaden von jedem deiner Charaktere.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Ambre",
    text: [
      {
        title: "LUEUR D'AMBRE",
        description: "— Retirez jusqu'à 1 dommage de chacun de vos personnages.",
      },
    ],
  },
  it: {
    name: "Cromicon d'Ambra",
    text: [
      {
        title: "LUCE D'AMBRA",
        description: "— Rimuovi fino a 1 danno da ogni tuo personaggio.",
      },
    ],
  },
};
