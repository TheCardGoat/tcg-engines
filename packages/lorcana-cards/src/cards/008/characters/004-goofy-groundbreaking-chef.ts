import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGroundbreakingChef: CharacterCard = {
  id: "t21",
  cardType: "character",
  name: "Goofy",
  version: "Groundbreaking Chef",
  fullName: "Goofy - Groundbreaking Chef",
  inkType: ["amber"],
  set: "008",
  text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 4,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "68b90a0038800e642717b1cfd159e7738b522975",
  },
  abilities: [
    {
      id: "t21-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "remove-damage",
          amount: 1,
          upTo: true,
          target: {
            selector: "all",
            count: "all",
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
