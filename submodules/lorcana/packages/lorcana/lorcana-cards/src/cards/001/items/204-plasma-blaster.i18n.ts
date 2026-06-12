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
        title: "SCHNELLFEUER, 2",
        description: "— Füge einem Charakter deiner Wahl 1 Schaden zu.",
      },
    ],
  },
  fr: {
    name: "PISTOLET À PLASMA",
    text: [
      {
        title: "TIR RAPIDE, 2",
        description: "— Choisissez un personnage et infligez-lui 1 dommage.",
      },
    ],
  },
  it: {
    name: "Plasma Blaster",
    text: [
      {
        title: "QUICK SHOT, 2",
        description: "— Deal 1 damage to chosen character.",
      },
    ],
  },
};
