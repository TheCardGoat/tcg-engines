import type { ItemCard } from "@tcg/lorcana-types";

export const sunglasses: ItemCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            amount: 1,
            target: "CONTROLLER",
            type: "draw",
          },
          {
            amount: 1,
            chosen: true,
            target: "CONTROLLER",
            type: "discard",
          },
        ],
        type: "sequence",
      },
      id: "18a-1",
      text: "SPYCRAFT {E} - Draw a card, then choose and discard a card.",
      type: "action",
    },
  ],
  cardNumber: 202,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "9ef44106d65017375195dd2f4b54d69416fa92e4",
  },
  franchise: "Lilo and Stitch",
  id: "18a",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "Sunglasses",
  set: "006",
  text: "SPYCRAFT {E} - Draw a card, then choose and discard a card.",
};
