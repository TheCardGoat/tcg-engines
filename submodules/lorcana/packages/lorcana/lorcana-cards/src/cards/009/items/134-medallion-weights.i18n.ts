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
        title: "Disziplin und Stärke",
        description:
          "{E}, 2 {I} — Gib einem Charakter deiner Wahl in diesem Zug +2 {S}. Jedes Mal, wenn er in diesem Zug einen anderen Charakter herausfordert, darfst du 1 Karte ziehen.",
      },
    ],
  },
  fr: {
    name: "Médaillons Lestés",
    text: [
      {
        title: "Discipline et Force",
        description:
          "{E}, 2 {I} — Choisissez un personnage qui gagne +2 {S} pour le reste de ce tour. Chaque fois qu'il défie un autre personnage durant ce tour, vous pouvez piocher une carte.",
      },
    ],
  },
  it: {
    name: "Pesi a Medaglia",
    text: [
      {
        title: "Disciplina e Forza",
        description:
          "{E}, 2 {I} — Un personaggio a tua scelta riceve +2 {S} per questo turno. Ogni volta che sfida un altro personaggio per questo turno, puoi pescare una carta.",
      },
    ],
  },
  es: {
    name: "Pesos de medallón",
    text: [
      {
        title: "DISCIPLINA Y FORTALEZA",
        description:
          "{E}, 2 {I}: el personaje elegido obtiene +2 {S} este turno. Siempre que desafíen a otro personaje este turno, puedes robar una carta.",
      },
    ],
  },
};
