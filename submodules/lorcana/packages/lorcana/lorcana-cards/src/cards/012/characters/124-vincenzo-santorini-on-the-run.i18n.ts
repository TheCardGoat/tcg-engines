import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const vincenzoSantoriniOnTheRunI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Vincenzo Santorini",
    version: "On the Run",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "NEUTRALIZE",
        description: "Opposing items can't ready at the start of their players' turns.",
      },
    ],
  },
  de: {
    name: "Vincenzo Santorini",
    version: "Auf der Flucht",
    text: [
      {
        title: "<Wendig>",
      },
      {
        title: "Neutralisieren",
        description: "Gegnerische Gegenstände werden zu Beginn ihres Zuges nicht bereit gemacht.",
      },
    ],
  },
  fr: {
    name: "Vincenzo Santorini",
    version: "En fuite",
    text: [
      {
        title: "<Insaisissable>",
      },
      {
        title: "Neutraliser",
        description:
          "Les objets adverses ne se redressent pas au début du tour de leur propriétaire.",
      },
    ],
  },
  it: {
    name: "Vincenzo Santorini",
    version: "In Fuga",
    text: [
      {
        title: "<Sfuggente>",
      },
      {
        title: "Neutralizzare",
        description:
          "Gli oggetti avversari non si possono preparare all'inizio del turno del loro giocatore.",
      },
    ],
  },
};
