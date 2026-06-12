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
        title: "LASS MICH DIR HELFEN",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, erhalten deine anderen Heldinnen und Helden in diesem Zug +1.",
      },
    ],
  },
  fr: {
    name: "Anna",
    version: "Cœur sincère",
    text: [
      {
        title: "LAISSE-MOI T'AIDER",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vos autres personnages Héros gagnent +1 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Anna",
    version: "Cuore Puro",
    text: [
      {
        title: "LASCIA CHE TI AIUTI",
        description:
          "Ogni volta che questo personaggio va all'avventura, i tuoi altri personaggi Eroe ricevono +1 per questo turno.",
      },
    ],
  },
};
