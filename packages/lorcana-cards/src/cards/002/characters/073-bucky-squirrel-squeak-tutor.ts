import type { CharacterCard } from "@tcg/lorcana-types";

export const buckySquirrelSqueakTutor: CharacterCard = {
  id: "tzh",
  cardType: "character",
  name: "Bucky",
  version: "Squirrel Squeak Tutor",
  fullName: "Bucky - Squirrel Squeak Tutor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  cardNumber: 73,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "6c124f28a9b74875d11667138240e90833dbd228",
  },
  abilities: [
    {
      id: "tzh-1",
      type: "triggered",
      name: "SQUEAK",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Floodborn",
        },
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play them",
        },
        then: {
          type: "discard",
          amount: 1,
          target: "EACH_OPPONENT",
          chosen: true,
        },
      },
      text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
