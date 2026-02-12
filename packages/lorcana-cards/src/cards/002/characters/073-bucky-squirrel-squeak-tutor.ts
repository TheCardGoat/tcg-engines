import type { CharacterCard } from "@tcg/lorcana-types";

export const buckySquirrelSqueakTutor: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you used Shift to play them",
          type: "if",
        },
        then: {
          amount: 1,
          chosen: true,
          target: "EACH_OPPONENT",
          type: "discard",
        },
        type: "conditional",
      },
      id: "tzh-1",
      name: "SQUEAK",
      text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 73,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "6c124f28a9b74875d11667138240e90833dbd228",
  },
  franchise: "Emperors New Groove",
  fullName: "Bucky - Squirrel Squeak Tutor",
  id: "tzh",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Bucky",
  set: "002",
  strength: 1,
  text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
  version: "Squirrel Squeak Tutor",
  willpower: 1,
};
