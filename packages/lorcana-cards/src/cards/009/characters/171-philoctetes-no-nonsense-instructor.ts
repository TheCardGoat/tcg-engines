import type { CharacterCard } from "@tcg/lorcana-types";

export const philoctetesNononsenseInstructor: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Challenger",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
        value: 1,
      },
      id: "1r4-1",
      name: "YOU GOTTA STAY FOCUSED Your Hero",
      text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1.",
      type: "static",
    },
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1r4-2",
      name: "SHAMELESS PROMOTER",
      text: "SHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Hero",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 171,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "e37669ed7364c22a0dc38be227ed36b062d4c5cf",
  },
  franchise: "Hercules",
  fullName: "Philoctetes - No-Nonsense Instructor",
  id: "1r4",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Philoctetes",
  set: "009",
  strength: 2,
  text: "YOU GOTTA STAY FOCUSED Your Hero characters gain Challenger +1. (They get +1 {S} while challenging.)\nSHAMELESS PROMOTER Whenever you play a Hero character, gain 1 lore.",
  version: "No-Nonsense Instructor",
  willpower: 3,
};
