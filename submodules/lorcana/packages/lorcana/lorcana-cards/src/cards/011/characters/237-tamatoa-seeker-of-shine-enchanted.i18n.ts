import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const tamatoaSeekerOfShineEnchantedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Tamatoa",
    version: "Seeker of Shine",
    text: [
      {
        title: "Boost 2 {I}",
      },
      {
        title: "Ward",
      },
      {
        title: "ANYTHING THAT GLITTERS",
        description:
          "Whenever you put a card under one of your characters or locations, this character gets +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Tamatoa",
    version: "Sucher des Glanzes",
    text: [
      {
        title: "<Stärken> 2 {I}",
      },
      {
        title: "<Behütet>",
      },
      {
        title: "Mache es Glänzend",
        description:
          "Jedes Mal, wenn du eine Karte unter einen deiner Charaktere oder Orte legst, erhält dieser Charakter in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Tamatoa",
    version: "Chercheur de bling-bling",
    text: [
      {
        title: "<Boost> 2 {I}",
      },
      {
        title: "<Hors d'atteinte>",
      },
      {
        title: "Tout ce qui est brillant",
        description:
          "Chaque fois que vous placez une carte sous l'un de vos personnages ou de vos lieux, ce personnage-ci gagne +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Tamatoa",
    version: "Cercatore di Splendore",
    text: "<Potenziamento> 2 {I}, <Protetto> Dietro un Luccichio Ogni volta che metti una carta sotto a uno dei tuoi personaggi o luoghi, questo personaggio riceve +1 {L} per questo turno.",
  },
};
