import type { ItemCard } from "@tcg/lorcana-types";

export const ingeniousDevice: ItemCard = {
  abilities: [
    {
      cost: {
        banishSelf: true,
        exert: true,
        ink: 2,
      },
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
      id: "12e-1",
      name: "SURPRISE PACKAGE",
      text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
      type: "activated",
    },
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        amount: 3,
        target: {
          selector: "chosen",
          count: 1,
          cardTypes: ["character", "location"],
        },
        type: "deal-damage",
      },
      id: "12e-2",
      name: "TIME GROWS SHORT",
      text: "TIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 201,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "8a50bd678c2214c7ff51d993613b9ce04f7e3fea",
  },
  franchise: "Peter Pan",
  id: "12e",
  inkType: ["steel"],
  inkable: false,
  name: "Ingenious Device",
  set: "010",
  text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.\nTIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
};
