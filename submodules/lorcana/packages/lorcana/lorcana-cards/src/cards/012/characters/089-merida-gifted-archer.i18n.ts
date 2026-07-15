import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const meridaGiftedArcherI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Merida",
    version: "Gifted Archer",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "FIERCE PROTECTION",
        description:
          "While this character is exerted, whenever an opposing character challenges, you may deal 1 damage to the challenging character.",
      },
    ],
  },
  de: {
    name: "Merida",
    version: "Begabte Bogenschützin",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Merida-Charaktere auszuspielen.)",
      },
      {
        title: "Unerschütterlicher Schutz",
        description:
          "Jedes Mal, wenn ein gegnerischer Charakter herausfordert, solange dieser Charakter erschöpft ist, darfst du dem herausfordernden Charakter 1 Schaden zufügen.",
      },
    ],
  },
  fr: {
    name: "Merida",
    version: "Archère talentueuse",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Merida.)",
      },
      {
        title: "Protection acharnée",
        description:
          "Tant que ce personnage est épuisé, chaque fois qu'un personnage adverse défie, vous pouvez infliger 1 dommage au personnage qui défie.",
      },
    ],
  },
  it: {
    name: "Merida",
    version: "Abile Arciera",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Merida.)",
      },
      {
        title: "Protezione Agguerrita",
        description:
          "Mentre questo personaggio è impegnato, ogni volta che un personaggio avversario sfida, puoi infliggere 1 danno al personaggio sfidante.",
      },
    ],
  },
};
