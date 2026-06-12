import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const diabloStoneServantI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Diablo",
    version: "Stone Servant",
    text: [
      {
        title: "CRUEL INTENT",
        description:
          "While you have a Villain character in play, this character gets +2 {S} and +1 {L}.",
      },
      {
        title: "VILLAINOUS BOND",
        description:
          "While this character is exerted, your Villain characters can't be challenged.",
      },
    ],
  },
  de: {
    name: "Diablo",
    version: "Diener aus Stein",
    text: [
      {
        title: "Gemeine Absicht",
        description:
          "Solange du mindestens einen Schurken im Spiel hast, erhält dieser Charakter +2 {S} und +1 {L}.",
      },
      {
        title: "Schurkische Bande",
        description:
          "Solange dieser Charakter erschöpft ist, können deine Schurken nicht herausgefordert werden.",
      },
    ],
  },
  fr: {
    name: "Diablo",
    version: "Serviteur de pierre",
    text: [
      {
        title: "Cruelle intention",
        description:
          "Tant que vous avez un personnage Méchant en jeu, ce personnage-ci gagne +2 {S} et +1 {L}.",
      },
      {
        title: "Lien maléfique",
        description:
          "Tant que ce personnage est épuisé, vos personnages Méchant ne peuvent pas être défiés.",
      },
    ],
  },
  it: {
    name: "Diablo",
    version: "Servitore di Pietra",
    text: [
      {
        title: "Intento Crudele",
        description:
          "Mentre hai in gioco un personaggio Cattivo, questo personaggio riceve +2 {S} e +1 {L}.",
      },
      {
        title: "Legame Malvagio",
        description:
          "Mentre questo personaggio è impegnato, i tuoi personaggi Cattivo non possono essere sfidati.",
      },
    ],
  },
};
