import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const wreckitRalphHerosDutyI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Wreck-It Ralph",
    version: "Hero's Duty",
    text: [
      {
        title: "OUTFLANK",
        description:
          "During your turn, whenever one of your other characters is banished, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Randale Ralph",
    version: "Hero's Duty",
    text: [
      {
        title: "Überflügeln",
        description:
          "Jedes Mal, wenn einer deiner anderen Charaktere in deinem Zug verbannt wird, erhält dieser Charakter in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Ralph la Casse",
    version: "Hero's Duty",
    text: [
      {
        title: "Contournement",
        description:
          "Durant votre tour, chaque fois que l'un de vos autres personnages est banni, ce personnage-ci gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Ralph Spaccatutto",
    version: "In Hero's Duty",
    text: [
      {
        title: "Aggirare",
        description:
          "Durante il tuo turno, ogni volta che uno dei tuoi altri personaggi viene esiliato, questo personaggio riceve +1 {L} per questo turno.",
      },
    ],
  },
};
