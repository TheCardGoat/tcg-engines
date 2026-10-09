import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyDancingSuperstarI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Dancing Superstar",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "Singer 6",
      },
      {
        title: "IN THE GROOVE",
        description:
          "Whenever this character quests, your other characters with Singer get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Tanzender Superstar",
    text: [
      {
        title:
          "<Gestaltwandel> 3 {I} (Du kannst 3 {I} zahlen, um diesen Charakter auf einen deiner Charaktere namens Goofy auszuspielen.)",
      },
      {
        title: "<Singen> 6 (Die Kosten dieses Charakters gelten als 6 für das Singen von Liedern.)",
      },
      {
        title: "Im Groove",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Charaktere mit <Singen> in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Superstar de la danse",
    text: [
      {
        title:
          "<Alter> 3 {I} (Vous pouvez payer 3 {I} pour jouer ce personnage sur l'un de vos personnages nommé Dingo.)",
      },
      {
        title:
          "<Mélomane> 6 (Ce personnage est considéré comme ayant un coût de 6 pour chanter des chansons.)",
      },
      {
        title: "Dans le groove",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages avec <Mélomane> gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Superstar del Ballo",
    text: [
      {
        title:
          "<Trasformazione> 3 {I} (Puoi pagare 3 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Pippo.)",
      },
      {
        title: "<Melodioso> 6",
      },
      {
        title: "Perso nel Ritmo",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi con <Melodioso> ricevono +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Goofy",
    version: "Dancing Superstar",
    text: [
      {
        title: "Shift 3 {I}",
      },
      {
        title: "Singer 6",
      },
      {
        title: "IN THE GROOVE",
        description:
          "Whenever this character quests, your other characters with Singer get +1 {L} this turn.",
      },
    ],
  },
};
