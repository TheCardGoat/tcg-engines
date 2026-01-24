import type { LocationCard } from "@tcg/lorcana-types";

export const sugarRushSpeedwayFinishLine: LocationCard = {
  id: "cxj",
  cardType: "location",
  name: "Sugar Rush Speedway",
  version: "Finish Line",
  fullName: "Sugar Rush Speedway - Finish Line",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "006",
  text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
  cost: 2,
  moveCost: 6,
  lore: 0,
  cardNumber: 35,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2e9b2654fee6bda12d63af97fba258e9e06d906c",
  },
  abilities: [
    {
      id: "cxj-1",
      type: "action",
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 3,
        },
        chooser: "CONTROLLER",
      },
      text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
    },
  ],
};
