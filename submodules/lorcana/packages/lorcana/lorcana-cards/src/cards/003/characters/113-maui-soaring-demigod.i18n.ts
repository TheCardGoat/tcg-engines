import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const mauiSoaringDemigodI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Maui",
    version: "Soaring Demigod",
    text: [
      {
        title: "Reckless",
      },
      {
        title: "IN MA BELLY",
        description:
          "Whenever a character of yours named HeiHei quests, this character gets +1 {L} and loses Reckless this turn.",
      },
    ],
  },
  de: {
    name: "Maui",
    version: "Aufstrebender Halbgott",
    text: [
      {
        title: "Impulsiv",
      },
      {
        title: "IN MEINEM BAUCH",
        description:
          "Jedes Mal, wenn einer deiner HeiHei-Charaktere erkundet, verliert dieser Charakter Impulsiv und erhält +1 in diesem Zug.",
      },
    ],
  },
  fr: {
    name: "Maui",
    version: "Demi-dieu planant",
    text: [
      {
        title: "Combattant",
      },
      {
        title: "DANS MON VENTRE",
        description:
          "Chaque fois que l'un de vos personnages Heihei est envoyé à l'aventure, ce personnage gagne +1 et perd Combattant pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Maui",
    version: "Semidio Alato",
    text: [
      {
        title: "Attaccabrighe",
      },
      {
        title: "NEL MIO STOMACO",
        description:
          "Ogni volta che un tuo personaggio chiamato Heihei va all'avventura, questo personaggio ottiene +1 e perde Attaccabrighe per questo turno.",
      },
    ],
  },
};
