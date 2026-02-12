import type { LocationCard } from "@tcg/lorcana-types";

export const thebesTheBigOlive: LocationCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "YOU CAN MAKE IT HERE... During your turn",
          type: "if",
        },
        then: {
          amount: 2,
          type: "gain-lore",
        },
        type: "conditional",
      },
      id: "niw-1",
      text: "IF YOU CAN MAKE IT HERE... During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
      type: "action",
    },
  ],
  cardNumber: 204,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "54c8fae6bda180eec50905712e19ba3aa890fda2",
  },
  franchise: "Hercules",
  fullName: "Thebes - The Big Olive",
  id: "niw",
  inkType: ["steel"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Thebes",
  set: "004",
  text: "IF YOU CAN MAKE IT HERE... During your turn, whenever a character banishes another character in a challenge while here, gain 2 lore.",
  version: "The Big Olive",
};
