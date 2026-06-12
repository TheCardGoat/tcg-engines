import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const goofyGalumphingGumshoeI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Goofy",
    version: "Galumphing Gumshoe",
    text: [
      {
        title: "Shift 5 {I}",
      },
      {
        title: "HOT PURSUIT",
        description:
          "When you play this character and whenever he quests, each opposing character gets -1 {S} until the start of your next turn.",
      },
    ],
  },
  de: {
    name: "Goofy",
    version: "Stolzierender Schnüffler",
    text: [
      {
        title: "Gestaltwandel 5",
      },
      {
        title: "HITZIGE VERFOLGUNGSJAGD",
        description:
          "Wenn du diesen Charakter ausspielst und jedes Mal, wenn er erkundet, gib allen gegnerischen Charakteren bis zu Beginn deines nächsten Zuges -1.",
      },
    ],
  },
  fr: {
    name: "Dingo",
    version: "Détective pas très privé",
    text: [
      {
        title: "Alter 5",
      },
      {
        title: "POURSUITE EFFRÉNÉE",
        description:
          "Lorsque vous jouez ce personnage et chaque fois qu'il est envoyé à l'aventure, chaque personnage adverse subit -1 jusqu'au début de votre prochain tour.",
      },
    ],
  },
  it: {
    name: "Pippo",
    version: "Investigatore Goffo",
    text: [
      {
        title: "Trasformazione 5",
      },
      {
        title: "INSEGUIMENTO SERRATO",
        description:
          "Quando giochi questo personaggio e ogni volta che va all'avventura, ogni personaggio avversario riceve -1 fino all'inizio del tuo prossimo turno.",
      },
    ],
  },
};
