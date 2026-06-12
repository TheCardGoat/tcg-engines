import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tiggerInTheCrowsNestI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tigger",
    version: "In the Crow's Nest",
    text: [
      {
        title: "Evasive",
      },
      {
        title: "SWASH YOUR BUCKLES",
        description:
          "Whenever you play an action, this character gets +1 {S} and +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Tigger",
    version: "Im Krähennest",
    text: [
      {
        title: "Wendig",
      },
      {
        title: "SCHWINGT EURE SCHNALLEN",
        description:
          "Jedes Mal, wenn du eine Aktion ausspielst, erhält dieser Charakter in diesem Zug +1 und +1.",
      },
    ],
  },
  fr: {
    name: "Tigrou",
    version: "Dans le nid-de-pie",
    text: [
      {
        title: "Insaisissable",
      },
      {
        title: "FANFARON",
        description:
          "Chaque fois que vous jouez une action, ce personnage gagne +1 et +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tigro",
    version: "Nella Coffa",
    text: [
      {
        title: "Sfuggente",
      },
      {
        title: "MOZZO, STAI ATTENTO",
        description:
          "Ogni volta che giochi un'azione, questo personaggio riceve +1 e +1 per questo turno.",
      },
    ],
  },
};
