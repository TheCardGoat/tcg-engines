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
        title: "DURCHSUCHT DEN SAND, 2",
        description:
          "— Nimm eine Illusions-Charakterkarte aus deinem Ablagestapel zurück auf deine Hand.",
      },
    ],
  },
  fr: {
    name: "Scarabée",
    text: [
      {
        title: "FOUILLER LE SABLE, 2",
        description: "— Renvoyez une carte Personnage Illusion de votre défausse dans votre main.",
      },
    ],
  },
  it: {
    name: "Scarabeo",
    text: [
      {
        title: "CERCATE TRA LE SABBIE, 2",
        description: "— Riprendi in mano una carta personaggio Illusione dai tuoi scarti.",
      },
    ],
  },
};
