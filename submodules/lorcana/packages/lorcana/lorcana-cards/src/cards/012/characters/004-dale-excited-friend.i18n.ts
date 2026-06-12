import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const daleExcitedFriendI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Dale",
    version: "Excited Friend",
    text: [
      {
        title: "LOOK WHAT",
        description:
          "I FOUND While you have a character named Chip in play, this character gets +1 {L}.",
      },
    ],
  },
  de: {
    name: "Chap",
    version: "Begeisterter Freund",
    text: [
      {
        title: "Schau, was ich gefunden habe",
        description:
          "Solange du mindestens einen Chip-Charakter im Spiel hast, erhält dieser Charakter +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Tac",
    version: "Ami enthousiaste",
    text: [
      {
        title: "Regarde ce que j'ai trouvé",
        description:
          "Tant que vous avez un personnage nommé Tic en jeu, ce personnage-ci gagne +1 {L}.",
      },
    ],
  },
  it: {
    name: "Ciop",
    version: "Amico Entusiasta",
    text: [
      {
        title: "Guarda Cosa Ho Trovato",
        description:
          "Mentre hai in gioco un personaggio chiamato Cip, questo personaggio riceve +1 {L}.",
      },
    ],
  },
};
