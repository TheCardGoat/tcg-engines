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
        title: "Stahlfarbenes Licht",
        description: "{E} — Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "Chromicône d'Acier",
    text: [
      {
        title: "Lueur d'acier",
        description: "{E} — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Cromicon d'Acciaio",
    text: [
      {
        title: "Luce d'Acciaio",
        description: "{E} — Infliggi 1 danno a un personaggio a tua scelta.",
      },
    ],
  },
  es: {
    name: "Cromicón de acero",
    text: [
      {
        title: "LUZ DE ACERO",
        description: "{E}: inflige 1 daño al personaje elegido.",
      },
    ],
  },
};
