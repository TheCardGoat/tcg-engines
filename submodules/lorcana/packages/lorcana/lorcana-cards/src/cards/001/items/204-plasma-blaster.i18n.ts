import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const plasmaBlasterI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Plasma Blaster",
    text: [
      {
        title: "QUICK SHOT",
        description: "{E}, 2 {I} — Deal 1 damage to chosen character.",
      },
    ],
  },
  de: {
    name: "Plasma-Kanone",
    text: [
      {
        title: "Schnellfeuer",
        description: "{E}, 2 {I} — Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "PISTOLET À PLASMA",
    text: [
      {
        title: "TIR RAPIDE",
        description: "{E}, 2 {I} — Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Plasma Blaster",
    text: [
      {
        title: "Quick Shot",
        description: "{E}, 2 {I} — Deal 1 damage to chosen character.",
      },
    ],
  },
};
