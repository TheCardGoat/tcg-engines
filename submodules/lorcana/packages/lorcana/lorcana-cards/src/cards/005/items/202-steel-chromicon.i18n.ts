import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const steelChromiconI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Steel Chromicon",
    text: [
      {
        title: "STEEL LIGHT",
        description: "{E} — Deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Stahl Chromikon",
    text: [
      {
        title: "STAHLFARBENES LICHT",
        description: "— Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Acier",
    text: [
      {
        title: "LUEUR D'ACIER",
        description: "— Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Cromicon d'Acciaio",
    text: [
      {
        title: "LUCE D'ACCIAIO",
        description: "— Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
};
