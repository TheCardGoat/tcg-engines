import type { CharacterCard } from "@tcg/lorcana-types";

export const honeyLemonChemistryWhiz: CharacterCard = {
  abilities: [
    {
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
      id: "1q1-1",
      text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
      type: "action",
    },
  ],
  cardNumber: 169,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Inventor"],
  cost: 2,
  externalIds: {
    ravensburger: "e1a975a55f05ee17bf5e1bfabc55037dc6a4e5d0",
  },
  franchise: "Big Hero 6",
  fullName: "Honey Lemon - Chemistry Whiz",
  id: "1q1",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Honey Lemon",
  set: "007",
  strength: 2,
  text: "PRETTY GREAT, HUH? Whenever you play a Floodborn character, if you used Shift to play them, you may remove up to 2 damage from chosen character.",
  version: "Chemistry Whiz",
  willpower: 2,
};
