import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const annaTrueheartedI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Anna",
    version: "True-Hearted",
    text: [
      {
        title: "LET ME HELP YOU",
        description:
          "Whenever this character quests, your other Hero characters get +1 {L} this turn.",
      },
    ],
  },
  de: {
    name: "Anna",
    version: "Wahres Herz",
    text: [
      {
        title: "Lass mich dir helfen",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Heldinnen und Helden in diesem Zug +1 {L}.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Cœur sincère",
    text: [
      {
        title: "Laisse-moi t'aider",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages Héros gagnent +1 {L} pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Cuore Puro",
    text: [
      {
        title: "Lascia che Ti Aiuti",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi Eroe ricevono +1 {L} per questo turno.",
      },
    ],
  },
  es: {
    name: "Ana",
    version: "Sincero",
    text: [
      {
        title: "Déjame ayudarte",
        description:
          "Siempre que este personaje realice una misión, tus otros personajes héroes obtienen +1 {L} este turno.",
      },
    ],
  },
};
