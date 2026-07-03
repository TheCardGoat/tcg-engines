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
    text: "Immer mit der... Ruhe Dieser Charakter kommt erschöpft ins Spiel. Intensive Forschung Jedes Mal, wenn dieser Charakter erkundet, darfst du einem Detektiv deiner Wahl in diesem Zug +2 {S} geben.",
  },
  fr: {
    name: "Flash",
    version: "Spécialiste des archives",
    text: "Une... petite... minute... Ce personnage entre en jeu épuisé. Recherche approfondie Chaque fois que ce personnage est envoyé à l'aventure, vous pouvez choisir un personnage Détective qui gagne +2 {S} pour le reste de ce tour.",
  },
  it: {
    name: "Flash",
    version: "Specialista degli Archivi",
    text: "Aspetta... Un Attimo Questo personaggio entra in gioco impegnato. Ricerca Approfondita Ogni volta che questo personaggio va all'avventura, puoi dare +2 {S} a un personaggio Detective a tua scelta per questo turno.",
  },
};
