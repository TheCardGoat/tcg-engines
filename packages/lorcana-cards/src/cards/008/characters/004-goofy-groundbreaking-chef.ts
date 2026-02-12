import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGroundbreakingChef: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: "all",
            owner: "any",
            selector: "all",
            zones: ["play"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "optional",
      },
      id: "t21-1",
      text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
      type: "action",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "68b90a0038800e642717b1cfd159e7738b522975",
  },
  fullName: "Goofy - Groundbreaking Chef",
  id: "t21",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Goofy",
  set: "008",
  strength: 3,
  text: "PLENTY TO GO AROUND At the end of your turn, you may remove up to 1 damage from each of your other characters. Ready each character you removed damage from this way.",
  version: "Groundbreaking Chef",
  willpower: 4,
};
