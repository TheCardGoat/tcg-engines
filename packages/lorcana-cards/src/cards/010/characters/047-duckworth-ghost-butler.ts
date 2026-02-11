import type { CharacterCard } from "@tcg/lorcana-types";

export const duckworthGhostButler: CharacterCard = {
  abilities: [
    {
      id: "1a3-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Ghost"],
  cost: 3,
  externalIds: {
    ravensburger: "a61ffd6081ddf7abbd9f662708d7db139dedca28",
  },
  franchise: "Ducktales",
  fullName: "Duckworth - Ghost Butler",
  id: "1a3",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Duckworth",
  set: "010",
  strength: 3,
  text: "Rush (This character can challenge the turn they're played.)\nFINAL ACT During your turn, when this character is banished, you may put the top card of your deck facedown under one of your characters or locations with Boost.",
  version: "Ghost Butler",
  willpower: 1,
};
