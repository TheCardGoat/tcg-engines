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
        title: "Was wirst du tun?",
        description:
          "{E}, 3 {I}, Verbanne einen deiner Charaktere — Verbanne einen Charakter deiner Wahl.",
      },
    ],
  },
  fr: {
    name: "Hadès",
    version: "Forçant la main",
    text: [
      {
        title: "C'est la vie",
        description:
          "{E}, 3 {I}, bannissez l'un de vos personnages — Choisissez et bannissez un personnage.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "Braccio Armato",
    text: [
      {
        title: "Cosa Farai Mai?",
        description:
          "{E}, 3 {I}, esilia uno dei tuoi personaggi — Esilia un personaggio a tua scelta.",
      },
    ],
  },
};
