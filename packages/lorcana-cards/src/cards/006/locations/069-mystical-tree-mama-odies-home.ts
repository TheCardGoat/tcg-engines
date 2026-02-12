import type { LocationCard } from "@tcg/lorcana-types";

export const mysticalTreeMamaOdiesHome: LocationCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a character named Mama Odie here",
          type: "if",
        },
        then: {
          amount: 1,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "pod-2",
      text: "HARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 69,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "5c8b11a683ee565ce158b3726f92b274eb01c534",
  },
  franchise: "Princess and the Frog",
  fullName: "Mystical Tree - Mama Odie's Home",
  id: "pod",
  inkType: ["amethyst"],
  inkable: true,
  lore: 0,
  missingImplementation: true,
  missingTests: true,
  moveCost: 1,
  name: "Mystical Tree",
  set: "006",
  text: "NOT BAD At the start of your turn, you may move 1 damage counter from chosen character here to chosen opposing character.\n\nHARD-EARNED WISDOM At the start of your turn, if you have a character named Mama Odie here, gain 1 lore.",
  version: "Mama Odie's Home",
};
