import type { LocationCard } from "@tcg/lorcana-types";

export const casaMadrigalCasita: LocationCard = {
  abilities: [
    {
      effect: {
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "gain-lore",
          amount: 1,
        },
        type: "conditional",
      },
      id: "115-1",
      text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
      type: "action",
    },
  ],
  cardNumber: 68,
  cardType: "location",
  cost: 1,
  externalIds: {
    ravensburger: "86c8f197eff8c61973ac292a62a4be6cd966c168",
  },
  franchise: "Encanto",
  fullName: "Casa Madrigal - Casita",
  id: "115",
  inkType: ["amethyst"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Casa Madrigal",
  set: "009",
  text: "OUR HOME At the start of your turn, if you have a character here, gain 1 lore.",
  version: "Casita",
};
