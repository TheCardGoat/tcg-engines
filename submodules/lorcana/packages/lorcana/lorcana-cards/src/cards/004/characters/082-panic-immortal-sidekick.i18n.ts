import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const panicImmortalSidekickI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Panic",
    version: "Immortal Sidekick",
    text: [
      {
        title: "REPORTING FOR DUTY",
        description:
          "While this character is exerted, if you have a character named Pain in play, your Villain characters can't be challenged.",
      },
    ],
  },
  de: {
    name: "Schwefel",
    version: "Unsterblicher Handlanger",
    text: [
      {
        title: "MELDEN SICH ZUM DIENST!",
        description:
          "Solange dieser Charakter erschöpft ist und du einen Pech-Charakter im Spiel hast, können deine Schurkinnen und Schurken nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Panique",
    version: "Sous-fifre immortel",
    text: [
      {
        title: "À VOS ORDRES",
        description:
          "Tant que ce personnage est épuisé, si vous avez un personnage Peine en jeu, vos personnages Méchant ne peuvent pas être défiés.",
      },
    ],
  },
  it: {
    name: "Panico",
    version: "Tirapiedi Immortale",
    text: [
      {
        title: "A RAPPORTO SIGNORE!",
        description:
          "Mentre questo personaggio è impegnato, se hai in gioco un personaggio chiamato Pena, i tuoi personaggi Cattivo non possono essere sfidati.",
      },
    ],
  },
};
