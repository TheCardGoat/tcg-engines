import type { CharacterCard } from "@tcg/lorcana";

export const merlinCompletingHisResearch: CharacterCard = {
  id: "mr7",
  cardType: "character",
  name: "Merlin",
  version: "Completing His Research",
  fullName: "Merlin - Completing His Research",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
  cost: 2,
  strength: 0,
  willpower: 3,
  lore: 2,
  cardNumber: 58,
  inkable: false,
  externalIds: {
    ravensburger: "5203ac82e44d01fa635507539a18d68b70569ca4",
  },
  abilities: [
    {
      id: "mr7-1",
      text: "Boost 2 {I}",
      type: "static",
    },
    {
      id: "mr7-2",
      name: "LEGACY OF LEARNING",
      text: "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
      type: "triggered",
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer", "Whisper"],
};
