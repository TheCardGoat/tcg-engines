import type { LocationCard } from "@tcg/lorcana-types";

export const rescueRangersSubmarineMobileHeadquarters: LocationCard = {
  id: "671",
  cardType: "location",
  name: "Rescue Rangers Submarine",
  version: "Mobile Headquarters",
  fullName: "Rescue Rangers Submarine - Mobile Headquarters",
  inkType: ["sapphire"],
  franchise: "Rescue Rangers",
  set: "006",
  text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 2,
  moveCost: 1,
  lore: 0,
  cardNumber: 169,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1654a41cbf0a5d8cffe06c1736a1ad9ce4668c19",
  },
  abilities: [
    {
      id: "671-1",
      type: "action",
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a character here",
        },
        then: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
      },
      text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
};
