import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const queenOfHeartsSensingWeaknessI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Queen of Hearts",
    version: "Sensing Weakness",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "LET THE GAME BEGIN",
        description:
          "Whenever one of your characters challenges another character, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Die Herzkönigin",
    version: "Wittert Schwäche",
    text: [
      {
        title:
          "<Gestaltwandel> 2 (Du kannst 2 {I} zahlen, um diesen Charakter auf einen deiner Die-Herzkönigin-Charaktere auszuspielen.)",
      },
      {
        title: "Dann soll das Spiel beginnen!",
        description:
          "Jedes Mal, wenn einer deiner Charaktere einen gegnerischen Charakter herausfordert, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "La Reine de Cœur",
    version: "Utilise les faiblesses",
    text: [
      {
        title:
          "<Alter> 2 (Vous pouvez payer 2 {I} pour jouer ce personnage sur l'un de vos personnages Reine de Cœur.)",
      },
      {
        title: "Que la partie commence",
        description:
          "Chaque fois que l'un de vos personnages en défie un autre, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Queen of Hearts",
    version: "Sensing Weakness",
    text: [
      {
        title:
          "<Shift> 2 (You may pay 2 {I} to play this on top of one of your characters named Queen of Hearts.)",
      },
      {
        title: "Let the Game Begin",
        description:
          "Whenever one of your characters challenges another character, you may draw a card.",
      },
    ],
  },
  es: {
    name: "Reina de corazones",
    version: "Sintiendo debilidad",
    text: [
      {
        title: "Shift 2 {I}",
      },
      {
        title: "QUE COMIENCE EL JUEGO",
        description:
          "Siempre que uno de tus personajes desafíe a otro personaje, puedes robar una carta.",
      },
    ],
  },
};
