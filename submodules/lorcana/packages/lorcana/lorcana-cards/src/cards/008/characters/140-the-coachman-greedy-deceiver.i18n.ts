import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const theCoachmanGreedyDeceiverI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "The Coachman",
    version: "Greedy Deceiver",
    text: [
      {
        title: "WILD RIDE",
        description:
          "While 2 or more characters of yours are exerted, this character gets +2 {S} and gains Evasive.",
      },
    ],
  },
  de: {
    name: "Der Kutscher",
    version: "Gieriger Betrüger",
    text: [
      {
        title: "WILDER RITT",
        description:
          "Solange 2 oder mehr deiner Charaktere erschöpft sind, erhält dieser Charakter +1 und Wendig.",
      },
    ],
  },
  fr: {
    name: "Le Cocher",
    version: "Trompeur avide",
    text: [
      {
        title: "COURSE EFFRÉNÉE",
        description:
          "Tant que vous avez 2 personnages ou plus épuisés, ce personnage-ci gagne +2 et Insaisissable.",
      },
    ],
  },
  it: {
    name: "Il Cocchiere",
    version: "Avido Ingannatore",
    text: [
      {
        title: "CORSA SFRENATA",
        description:
          "Mentre 2 o più tuoi personaggi sono impegnati, questo personaggio riceve +2 e ottiene Sfuggente. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
