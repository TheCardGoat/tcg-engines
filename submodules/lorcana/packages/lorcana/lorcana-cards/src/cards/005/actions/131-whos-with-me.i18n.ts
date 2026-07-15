import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const whosWithMeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Who's With Me?",
    text: [
      {
        title: "Your characters get +2 {S} this turn.",
      },
      {
        title:
          "Whenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Wer kommt mit mir?",
    text: [
      {
        title: "Deine Charaktere erhalten in diesem Zug +2 {S}.",
      },
      {
        title:
          "Jedes Mal, wenn einer deiner Charaktere mit <Impulsiv> in diesem Zug einen anderen Charakter herausfordert, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Qui est avec moi ?",
    text: [
      {
        title: "Vos personnages gagnent +2 {S} pour le reste de ce tour.",
      },
      {
        title:
          "Chaque fois qu'un personnage avec <Combattant> défie un personnage ce tour-ci, gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Chi Viene con Me?",
    text: [
      {
        title: "I tuoi personaggi ricevono +2 {S} per questo turno.",
      },
      {
        title:
          "Ogni volta che uno dei tuoi personaggi con <Attaccabrighe> sfida un altro personaggio per questo turno, ottieni 2 leggenda.",
      },
    ],
  },
};
