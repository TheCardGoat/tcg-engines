import type { LocationCard } from "@tcg/lorcana-types";

export const rescueRangersSubmarineMobileHeadquarters: LocationCard = {
  abilities: [
    {
      effect: {
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
        type: "conditional",
      },
      id: "671-1",
      text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  cardNumber: 169,
  cardType: "location",
  cost: 2,
  externalIds: {
    ravensburger: "1654a41cbf0a5d8cffe06c1736a1ad9ce4668c19",
  },
  franchise: "Rescue Rangers",
  fullName: "Rescue Rangers Submarine - Mobile Headquarters",
  id: "671",
  inkType: ["sapphire"],
  inkable: true,
  lore: 0,
  missingTests: true,
  moveCost: 1,
  name: "Rescue Rangers Submarine",
  set: "006",
  text: "PLANNING SESSION At the start of your turn, if you have a character here, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Mobile Headquarters",
};
