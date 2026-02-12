import type { LocationCard } from "@tcg/lorcana-types";

export const sugarRushSpeedwayFinishLine: LocationCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "gain-lore",
          amount: 3,
        },
        chooser: "CONTROLLER",
      },
      id: "cxj-1",
      text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
      type: "action",
    },
  ],
  cardNumber: 35,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "2e9b2654fee6bda12d63af97fba258e9e06d906c",
  },
  franchise: "Wreck It Ralph",
  fullName: "Sugar Rush Speedway - Finish Line",
  id: "cxj",
  inkType: ["amber"],
  inkable: false,
  lore: 0,
  missingTests: true,
  moveCost: 6,
  name: "Sugar Rush Speedway",
  set: "006",
  text: "BRING IT HOME, LITTLE ONE! When you move a character here from another location, you may banish this location to gain 3 lore and draw 3 cards.",
  version: "Finish Line",
};
