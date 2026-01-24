import type { LocationCard } from "@tcg/lorcana-types";

export const casaMadrigalCasita: LocationCard = {
  id: "115",
  cardType: "location",
  name: "Casa Madrigal",
  version: "Casita",
  fullName: "Casa Madrigal - Casita",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "009",
  text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
  cost: 1,
  moveCost: 1,
  lore: 0,
  cardNumber: 68,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "86c8f197eff8c61973ac292a62a4be6cd966c168",
  },
  abilities: [
    {
      id: "115-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
      },
      text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
    },
  ],
};
