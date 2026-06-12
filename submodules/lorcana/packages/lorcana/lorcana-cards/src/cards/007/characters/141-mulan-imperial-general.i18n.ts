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
        title: "Gestaltwandel 5",
      },
      {
        title: "Wendig",
      },
      {
        title: "AUSSERGEWÖHNLICHE ANFÜHRERIN",
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
        title: "Alter 5",
      },
      {
        title: "Insaisissable",
      },
      {
        title: "MENEUSE EXCEPTIONNELLE",
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
        title: "Trasformazione 5",
      },
      {
        title: "Sfuggente",
      },
      {
        title: "LEADER ECCEZIONALE",
        description:
          'Ogni volta che questo personaggio sfida un altro personaggio, i tuoi altri personaggi ottengono "Questo personaggio può sfidare i personaggi preparati" per questo turno.',
      },
    ],
  },
};
