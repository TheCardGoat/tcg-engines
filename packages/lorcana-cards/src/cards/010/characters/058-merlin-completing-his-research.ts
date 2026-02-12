import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCompletingHisResearch: CharacterCard = {
  abilities: [
    {
      id: "mr7-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        condition: {
          expression: "he had a card under him",
          type: "if",
        },
        then: {
          amount: 2,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "conditional",
      },
      id: "mr7-2",
      name: "LEGACY OF LEARNING",
      text: "LEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 58,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer", "Whisper"],
  cost: 2,
  externalIds: {
    ravensburger: "5203ac82e44d01fa635507539a18d68b70569ca4",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Completing His Research",
  id: "mr7",
  inkType: ["amethyst"],
  inkable: false,
  lore: 2,
  name: "Merlin",
  set: "010",
  strength: 0,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nLEGACY OF LEARNING When this character is banished in a challenge, if he had a card under him, draw 2 cards.",
  version: "Completing His Research",
  willpower: 3,
};
