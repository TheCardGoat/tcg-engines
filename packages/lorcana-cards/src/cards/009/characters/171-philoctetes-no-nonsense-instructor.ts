import type { CharacterCard } from "@tcg/lorcana-types";

export const philoctetesNononsenseInstructor: CharacterCard = {
  id: "1r4",
  cardType: "character",
  name: "Philoctetes",
  version: "No-Nonsense Instructor",
  fullName: "Philoctetes - No-Nonsense Instructor",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 171,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e37669ed7364c22a0dc38be227ed36b062d4c5cf",
  },
  abilities: [
    {
      id: "1r4-1",
      type: "static",
      effect: {
        type: "gain-keyword",
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        value: 1,
      },
      name: "YOU GOTTA STAY FOCUSED Your Hero",
      text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1.",
    },
    {
      id: "1r4-2",
      type: "triggered",
      name: "SHAMELESS PROMOTER",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "character",
          classification: "Hero",
        },
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
