import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesStrongArmI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "Strong Arm",
    text: [
      {
        title: "WHAT ARE YOU GONNA DO?",
        description: "{E}, 3 {I}, Banish one of your characters — Banish chosen character.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "Starker Arm",
    text: [
      {
        title: "WAS WIRST DU TUN?, 3,",
        description: "Verbanne einen deiner Charaktere — Verbanne einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Hadès",
    version: "Forçant la main",
    text: [
      {
        title: "C'EST LA VIE, 3,",
        description: "bannissez l'un de vos personnages — Choisissez et bannissez un personnage.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "Braccio Armato",
    text: [
      {
        title: "COSA FARAI MAI?, 3,",
        description: "esilia uno dei tuoi personaggi — Esilia un personaggio a tua scelta.",
      },
    ],
  },
};
