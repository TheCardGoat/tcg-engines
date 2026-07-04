import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const teKElementalTerrorI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Te Kā",
    version: "Elemental Terror",
    text: [
      {
        title: "Shift 7",
      },
      {
        title: "ANCIENT RAGE",
        description: "During your turn, whenever an opposing character is exerted, banish them.",
      },
    ],
  },
  de: {
    name: "Te Kā",
    version: "Elementarer Terror",
    text: [
      {
        title:
          "<Gestaltwandel> 7 (Du kannst 7 {I} zahlen, um diesen Charakter auf einen deiner Te-Kā-Charaktere auszuspielen.)",
      },
      {
        title: "Alter Zorn",
        description:
          "Jedes Mal während deines Zuges, wenn ein gegnerischer Charakter erschöpft wird, verbanne ihn.",
      },
    ],
  },
  fr: {
    name: "TE KĀ",
    version: "Terreur élémentaire",
    text: [
      {
        title:
          "<Alter> 7 (Vous pouvez payer 7 {I} pour jouer ce personnage sur l'un de vos personnages Te Kā.)",
      },
      {
        title: "Rage ancestrale",
        description:
          "Durant votre tour, chaque fois qu'un personnage adverse devient épuisé, bannissez-le.",
      },
    ],
  },
  it: {
    name: "Te Kā",
    version: "Terrore Elementale",
    text: [
      {
        title:
          "<Trasformazione> 7 (Puoi pagare 7 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Te Kā.)",
      },
      {
        title: "Rabbia Antica",
        description:
          "Durante il tuo turno, ogni volta che un personaggio avversario viene impegnato, esilialo.",
      },
    ],
  },
};
