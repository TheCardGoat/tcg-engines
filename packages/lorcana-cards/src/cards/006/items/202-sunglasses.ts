import type { ItemCard } from "@tcg/lorcana-types";

export const sunglasses: ItemCard = {
  id: "18a",
  cardType: "item",
  name: "Sunglasses",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "006",
  text: "SPYCRAFT {E} - Draw a card, then choose and discard a card.",
  cost: 4,
  cardNumber: 202,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9ef44106d65017375195dd2f4b54d69416fa92e4",
  },
  abilities: [
    {
      id: "18a-1",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
          {
            type: "discard",
            amount: 1,
            target: "CONTROLLER",
            chosen: true,
          },
        ],
      },
      text: "SPYCRAFT {E} - Draw a card, then choose and discard a card.",
    },
  ],
};
