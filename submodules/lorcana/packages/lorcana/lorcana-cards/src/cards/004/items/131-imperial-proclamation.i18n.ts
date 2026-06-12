import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const imperialProclamationI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Imperial Proclamation",
    text: [
      {
        title: "CALL TO THE FRONT",
        description:
          "Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
      },
    ],
  },
  de: {
    name: "Kaiserliche Bekanntmachung",
    text: [
      {
        title: "RUF AN DIE FRONT",
        description:
          "Jedes Mal, wenn einer deiner Charaktere einen anderen Charakter herausfordert, zahlst du 1 weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Décret Impérial",
    text: [
      {
        title: "APPELÉ AU FRONT",
        description:
          "Chaque fois que l'un de vos personnages en défie un autre, le prochain personnage que vous jouez durant ce tour coûte 1 de moins.",
      },
    ],
  },
  it: {
    name: "Proclama Imperiale",
    text: [
      {
        title: "CHIAMATA ALLE ARMI",
        description:
          "Ogni volta che uno dei tuoi personaggi sfida un altro personaggio, paga 1 in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
