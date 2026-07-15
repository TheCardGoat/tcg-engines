import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mulanImperialGeneralI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Mulan",
    version: "Imperial General",
    text: [
      {
        title: "Shift 5",
      },
      {
        title: "Evasive",
      },
      {
        title: "EXCEPTIONAL LEADER",
        description:
          'Whenever this character challenges another character, your other characters gain "This character can challenge ready characters" this turn.',
      },
    ],
  },
  de: {
    name: "Mulan",
    version: "Kaiserliche Generalin",
    text: [
      {
        title:
          "<Gestaltwandel> 5 (Du kannst 5 {I} zahlen, um diesen Charakter auf einen deiner Mulan-Charaktere auszuspielen.)",
      },
      {
        title: "<Wendig>",
      },
      {
        title: "Außergewöhnliche Anführerin",
        description:
          'Jedes Mal, wenn dieser Charakter einen anderen Charakter herausfordert, erhalten deine anderen Charaktere in diesem Zug "Dieser Charakter kann bereite Charaktere herausfordern".',
      },
    ],
  },
  fr: {
    name: "Mulan",
    version: "Générale impériale",
    text: [
      {
        title:
          "<Alter> 5 (Vous pouvez payer 5 {I} pour jouer ce personnage sur l'un de vos personnages Mulan.)",
      },
      {
        title: "<Insaisissable>",
      },
      {
        title: "Meneuse exceptionnelle",
        description:
          'Chaque fois que ce personnage en défie un autre, vos autres personnages gagnent "Ce personnage peut défier des personnages redressés." pour le reste de ce tour.',
      },
    ],
  },
  it: {
    name: "Mulan",
    version: "Generale Imperiale",
    text: [
      {
        title:
          "<Trasformazione> 5 (Puoi pagare 5 {I} per giocare questa carta sopra a uno dei tuoi personaggi chiamato Mulan.)",
      },
      {
        title: "<Sfuggente>",
      },
      {
        title: "Leader Eccezionale",
        description:
          'Ogni volta che questo personaggio sfida un altro personaggio, i tuoi altri personaggi ottengono "Questo personaggio può sfidare i personaggi preparati" per questo turno.',
      },
    ],
  },
};
