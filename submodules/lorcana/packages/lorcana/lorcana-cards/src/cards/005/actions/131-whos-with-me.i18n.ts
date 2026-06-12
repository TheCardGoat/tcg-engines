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
    text: "Deine Charaktere erhalten in diesem Zug +2. Jedes Mal, wenn einer deiner Charaktere mit Impulsiv in diesem Zug einen anderen Charakter herausfordert, sammelst du 2 Legenden.",
  },
  fr: {
    name: "Qui est avec moi ?",
    text: "Vos personnages gagnent +2 pour le reste de ce tour. Chaque fois qu'un personnage avec Combattant défie un personnage ce tour-ci, gagnez 2 éclats de Lore.",
  },
  it: {
    name: "Chi Viene con Me?",
    text: "I tuoi personaggi ricevono +2 per questo turno. Ogni volta che uno dei tuoi personaggi con Attaccabrighe sfida un altro personaggio per questo turno, ottieni 2 leggenda.",
  },
};
