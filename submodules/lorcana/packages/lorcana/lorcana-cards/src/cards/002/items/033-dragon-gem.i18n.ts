import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const dragonGemI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dragon Gem",
    text: [
      {
        title: "BRING BACK TO LIFE",
        description:
          "{E}, 3 {I} — Return a character card with Support from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Drachenjuwel",
    text: [
      {
        title: "WIEDERBELEBEN, 3",
        description:
          "— Nimm eine Charakterkarte mit der Fähigkeit Unterstützen aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Pierre de Dragon",
    text: [
      {
        title: "RAMENER",
        description: "À LA VIE, 3 — Reprenez en main un personnage avec Soutien de votre défausse.",
      },
    ],
  },
  it: {
    name: "Dragon Gem",
    text: [
      {
        title: "BRING BACK TO LIFE, 3",
        description: "— Return a character card with Support from your discard to your hand.",
      },
    ],
  },
};
