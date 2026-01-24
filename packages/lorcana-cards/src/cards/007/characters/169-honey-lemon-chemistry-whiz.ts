import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemistryWhiz: CharacterCard = {
  id: "1q1",
  cardType: "character",
  name: "Honey Lemon",
  version: "Chemistry Whiz",
  fullName: "Honey Lemon - Chemistry Whiz",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "007",
  text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e1a975a55f05ee17bf5e1bfabc55037dc6a4e5d0",
  },
  abilities: [
    {
      id: "1q1-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play them",
        },
        then: {
          type: "remove-damage",
          amount: 2,
          upTo: true,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Inventor"],
};
