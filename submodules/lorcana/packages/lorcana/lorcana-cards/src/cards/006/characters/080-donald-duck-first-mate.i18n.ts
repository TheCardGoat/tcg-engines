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
        title: "KAPITÄN AN DECK",
        description:
          "Solange du mindestens einen Kapitän im Spiel hast, erhält dieser Charakter +2.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Second",
    text: [
      {
        title: "CAPITAINE SUR LE PONT",
        description:
          "Tant que vous avez un personnage Capitaine en jeu, ce personnage-ci gagne +2.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Primo Ufficiale",
    text: [
      {
        title: "CAPITANO SUL PONTE",
        description: "Mentre hai in gioco un personaggio Capitano, questo personaggio riceve +2.",
      },
    ],
  },
};
