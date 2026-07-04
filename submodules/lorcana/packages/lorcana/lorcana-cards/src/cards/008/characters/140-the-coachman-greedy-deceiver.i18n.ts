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
        title: "Wilder Ritt",
        description:
          "Solange 2 oder mehr deiner Charaktere erschöpft sind, erhält dieser Charakter +2 {S} und <Wendig>.",
      },
    ],
  },
  fr: {
    name: "Le Cocher",
    version: "Trompeur avide",
    text: [
      {
        title: "Course effrénée",
        description:
          "Tant que vous avez 2 personnages ou plus épuisés, ce personnage-ci gagne +2 {S} et <Insaisissable>.",
      },
    ],
  },
  it: {
    name: "Il Cocchiere",
    version: "Avido Ingannatore",
    text: [
      {
        title: "Corsa Sfrenata",
        description:
          "Mentre 2 o più tuoi personaggi sono impegnati, questo personaggio riceve +2 {S} e ottiene <Sfuggente>. (Solo altri personaggi con Sfuggente possono sfidarlo.)",
      },
    ],
  },
};
