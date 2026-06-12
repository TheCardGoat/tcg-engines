import type { I18nProperties, Languages } from "@tcg/lorcana-types";

export const flashRecordsSpecialistI18n: Record<Languages, I18nProperties> = {
  en: {
    name: "Flash",
    version: "Records Specialist",
    text: [
      {
        title: "HOLD...",
      },
      {
        title: "YOUR HORSES",
        description: "This character enters play exerted.",
      },
      {
        title: "DEEP RESEARCH",
        description:
          "Whenever this character quests, you may give chosen Detective character +2 {S} this turn.",
      },
    ],
  },
  de: {
    name: "Flash",
    version: "Spezialist für Aktenführung",
    text: [
      {
        title: "IMMER MIT DER...",
      },
      {
        title: "RUHE",
        description: "Dieser Charakter kommt erschöpft ins Spiel.",
      },
      {
        title: "INTENSIVE FORSCHUNG",
        description:
          "Jedes Mal, wenn dieser Charakter erkundet, darfst du einem Detektiv deiner Wahl in diesem Zug +2 geben.",
      },
    ],
  },
  fr: {
    name: "Flash",
    version: "Spécialiste des archives",
    text: [
      {
        title: "UNE...",
      },
      {
        title: "PETITE...",
      },
      {
        title: "MINUTE...",
        description: "Ce personnage entre en jeu épuisé.",
      },
      {
        title: "RECHERCHE APPROFONDIE",
        description:
          "Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage Détective qui gagne +2 pour le reste de ce tour.",
      },
    ],
  },
  it: {
    name: "Flash",
    version: "Specialista degli Archivi",
    text: [
      {
        title: "ASPETTA...",
      },
      {
        title: "UN ATTIMO",
        description: "Questo personaggio entra in gioco impegnato.",
      },
      {
        title: "RICERCA APPROFONDITA",
        description:
          "Ogni volta che questo personaggio va all'avventura, puoi dare +2 a un personaggio Detective a tua scelta per questo turno.",
      },
    ],
  },
};
