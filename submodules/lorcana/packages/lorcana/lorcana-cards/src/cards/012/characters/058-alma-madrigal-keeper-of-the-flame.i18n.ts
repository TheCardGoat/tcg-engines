import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const almaMadrigalKeeperOfTheFlameI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Alma Madrigal",
    version: "Keeper of the Flame",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "THAT'S ENOUGH",
        description:
          "Whenever you remove 1 or more damage from one of your characters, you may exert chosen opposing character.",
      },
    ],
  },
  de: {
    name: "Alma Madrigal",
    version: "Hüterin der Flamme",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Alma-Madrigal-Charaktere auszuspielen.)",
      },
      {
        title: "Das reicht",
        description:
          "Jedes Mal, wenn du 1 oder mehr Schaden von einem deiner Charaktere entfernst, darfst du einen gegnerischen Charakter deiner Wahl erschöpfen.",
      },
    ],
  },
  fr: {
    name: "Alma Madrigal",
    version: "Gardienne de la flamme",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Alma Madrigal.)",
      },
      {
        title: "Ça suffit",
        description:
          "Chaque fois que vous retirez 1 dommage ou plus de l'un de vos personnages, vous pouvez choisir un personnage adverse et l'épuiser.",
      },
    ],
  },
  it: {
    name: "Alma Madrigal",
    version: "Custode della Fiamma",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Alma Madrigal.)",
      },
      {
        title: "Ora Basta",
        description:
          "Ogni volta che rimuovi 1 o più danni da uno dei tuoi personaggi, puoi impegnare un personaggio avversario a tua scelta.",
      },
    ],
  },
};
