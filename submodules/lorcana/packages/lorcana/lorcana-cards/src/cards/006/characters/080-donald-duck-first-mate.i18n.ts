import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckFirstMateI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "First Mate",
    text: [
      {
        title: "CAPTAIN ON DECK",
        description: "While you have a Captain character in play, this character gets +2 {L}.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Erster Maat",
    text: [
      {
        title: "Kapitän an Deck",
        description:
          "Solange du mindestens einen Kapitän im Spiel hast, erhält dieser Charakter +2 {L}.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Second",
    text: [
      {
        title: "Capitaine sur le pont",
        description:
          "Tant que vous avez un personnage Capitaine en jeu, ce personnage-ci gagne +2 {L}.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Primo Ufficiale",
    text: [
      {
        title: "Capitano sul Ponte",
        description:
          "Mentre hai in gioco un personaggio Capitano, questo personaggio riceve +2 {L}.",
      },
    ],
  },
};
