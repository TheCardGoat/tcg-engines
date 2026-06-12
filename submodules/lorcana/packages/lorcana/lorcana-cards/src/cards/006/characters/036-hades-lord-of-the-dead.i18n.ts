import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const hadesLordOfTheDeadI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Hades",
    version: "Lord of the Dead",
    text: [
      {
        title: "SOUL COLLECTOR",
        description:
          "Whenever one of your other characters is banished during the opponent's turn, gain 2 lore.",
      },
    ],
  },
  de: {
    name: "Hades",
    version: "Herr der Unterwelt",
    text: [
      {
        title: "SEELENSAMMLER",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere im Zug einer gegnerischen Person verbannt wird, sammelst du 2 Legenden.",
      },
    ],
  },
  fr: {
    name: "Hadès",
    version: "Dieu des enfers",
    text: [
      {
        title: "COLLECTEUR D'ÂMES",
        description:
          "Durant le tour de vos adversaires, chaque fois que l'un de vos autres personnages est banni, vous gagnez 2 éclats de Lore.",
      },
    ],
  },
  it: {
    name: "Ade",
    version: "Signore dei Morti",
    text: [
      {
        title: "COLLEZIONISTA DI ANIME",
        description:
          "Durante il turno di un avversario, ogni volta che uno dei tuoi altri personaggi viene esiliato, ottieni 2 leggenda.",
      },
    ],
  },
};
