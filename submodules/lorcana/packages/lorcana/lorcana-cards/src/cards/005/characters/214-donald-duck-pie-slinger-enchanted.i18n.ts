import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const donaldDuckPieSlingerEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Donald Duck",
    version: "Pie Slinger",
    text: [
      {
        title: "Shift 4",
      },
      {
        title: "HUMBLE PIE",
        description:
          "When you play this character, if you used Shift to play him, each opponent loses 2 lore.",
      },
      {
        title: "RAGING DUCK",
        description: "While an opponent has 10 or more lore, this character gets +6 {S}.",
      },
    ],
  },
  de: {
    name: "Donald Duck",
    version: "Kuchenschleuderer",
    text: [
      {
        title:
          "<Gestaltwandel> 4 (Du kannst 4 {I} zahlen, um diesen Charakter auf einen deiner Donald-Duck-Charaktere auszuspielen.)",
      },
      {
        title: "Pustekuchen",
        description:
          "Wenn du diesen Charakter ausspielst, falls du <Gestaltwandel> benutzt hast, um diesen Charakter auszuspielen, verlieren alle gegnerischen Mitspielenden je 2 Legenden.",
      },
      {
        title: "Wütende Ente",
        description:
          "Solange mindestens eine gegnerische Person 10 oder mehr Legenden hat, erhält dieser Charakter +6 {S}.",
      },
    ],
  },
  fr: {
    name: "Donald",
    version: "Lanceur de tartes",
    text: [
      {
        title:
          "<Alter> 4 (Vous pouvez payer 4 {I} pour jouer ce personnage sur l'un de vos personnages Donald.)",
      },
      {
        title: "Une simple tarte",
        description:
          "Si vous jouez ce personnage en utilisant sa capacité <Alter>, chaque adversaire perd 2 éclats de Lore.",
      },
      {
        title: "Canard enragé",
        description:
          "Tant qu'un adversaire a 10 éclats de Lore ou plus, ce personnage gagne +6 {S}.",
      },
    ],
  },
  it: {
    name: "Paperino",
    version: "Lanciatore di Torte",
    text: [
      {
        title:
          "<Trasformazione> 4 (Puoi pagare 4 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Paperino.)",
      },
      {
        title: "Torta di Umiltà",
        description:
          "Quando giochi questo personaggio, se hai usato <Trasformazione> per giocarlo, ogni avversario perde 2 leggenda.",
      },
      {
        title: "Papero Iracondo",
        description: "Mentre un avversario ha 10 o più leggenda, questo personaggio riceve +6 {S}.",
      },
    ],
  },
};
