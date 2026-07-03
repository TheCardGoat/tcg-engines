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
        title: "Ruf an die Front",
        description:
          "Jedes Mal, wenn einer deiner Charaktere einen anderen Charakter herausfordert, zahlst du 1 {I} weniger für den nächsten Charakter, den du in diesem Zug ausspielst.",
      },
    ],
  },
  fr: {
    name: "Décret Impérial",
    text: [
      {
        title: "Appelé au front",
        description:
          "Chaque fois que l'un de vos personnages en défie un autre, le prochain personnage que vous jouez durant ce tour coûte 1 {I} de moins.",
      },
    ],
  },
  it: {
    name: "Proclama Imperiale",
    text: [
      {
        title: "Chiamata alle Armi",
        description:
          "Ogni volta che uno dei tuoi personaggi sfida un altro personaggio, paga 1 {I} in meno per giocare il tuo prossimo personaggio per questo turno.",
      },
    ],
  },
};
