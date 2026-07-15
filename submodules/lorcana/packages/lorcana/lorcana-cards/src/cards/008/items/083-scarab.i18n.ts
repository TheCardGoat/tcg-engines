import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const scarabI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Scarab",
    text: [
      {
        title: "SEARCH THE SANDS",
        description:
          "{E} 2 {I} — Return an Illusion character card from your discard to your hand.",
      },
    ],
  },
  de: {
    name: "Skarabäus",
    text: [
      {
        title: "Durchsucht den Sand",
        description:
          "{E}, 2 {I} — Nimm eine Illusions-Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Scarabée",
    text: [
      {
        title: "Fouiller le sable",
        description:
          "{E}, 2 {I} — Renvoyez une carte Personnage Illusion de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Scarabeo",
    text: [
      {
        title: "Cercate tra le Sabbie",
        description:
          "{E}, 2 {I} — Riprendi in mano una carta personaggio Illusione dai tuoi scarti.",
      },
    ],
  },
};
