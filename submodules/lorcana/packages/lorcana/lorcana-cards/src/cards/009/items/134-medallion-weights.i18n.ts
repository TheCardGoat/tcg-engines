import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const medallionWeightsI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Medallion Weights",
    text: [
      {
        title: "DISCIPLINE AND STRENGTH",
        description:
          "{E}, 2 {I} — Chosen character gets +2 {S} this turn. Whenever they challenge another character this turn, you may draw a card.",
      },
    ],
  },
  de: {
    name: "Gewichte der Medaillen",
    text: [
      {
        title: "DISZIPLIN UND",
        description:
          "STÄRKE, 2 — Gib einem Charakter deiner Wahl in diesem Zug +2. Jedes Mal, wenn er in diesem Zug einen anderen Charakter herausfordert, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Médaillons Lestés",
    text: [
      {
        title: "DISCIPLINE ET FORCE, 2",
        description:
          "— Choisissez un personnage qui gagne +2 pour le reste de ce tour. Chaque fois qu'il défie un autre personnage durant ce tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pesi a Medaglia",
    text: [
      {
        title: "DISCIPLINA E FORZA, 2",
        description:
          "— Un personaggio a tua scelta riceve +2 per questo turno. Ogni volta che sfida un altro personaggio per questo turno, puoi pescare una carta.",
      },
    ],
  },
};
