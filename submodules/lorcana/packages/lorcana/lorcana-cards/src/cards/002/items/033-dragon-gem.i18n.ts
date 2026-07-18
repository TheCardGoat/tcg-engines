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
        title: "Wiederbeleben",
        description:
          "{E}, 3 {I} — Nimm eine Charakterkarte mit der Fähigkeit <Unterstützen> aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Pierre de Dragon",
    text: [
      {
        title: "Ramener à la vie",
        description:
          "{E}, 3 {I} — Reprenez en main un personnage avec <Soutien> de votre défausse.",
      },
    ],
  },
  it: {
    name: "Dragon Gem",
    text: [
      {
        title: "Bring Back to Life",
        description:
          "{E}, 3 {I} — Return a character card with <Support> from your discard to your hand.",
      },
    ],
  },
  es: {
    name: "Gema del Dragón",
    text: [
      {
        title: "DEVOLVER A LA VIDA",
        description:
          "{E}, 3 {I}: Devuelve a tu mano una carta de personaje con Apoyo de tu descarte.",
      },
    ],
  },
};
