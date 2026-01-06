import type { ItemCard } from "@tcg/lorcana-types";

export const ingeniousDevice: ItemCard = {
  id: "12e",
  cardType: "item",
  name: "Ingenious Device",
  inkType: ["steel"],
  franchise: "Peter Pan",
  set: "010",
  text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.\nTIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
  cost: 3,
  cardNumber: 201,
  inkable: false,
  externalIds: {
    ravensburger: "8a50bd678c2214c7ff51d993613b9ce04f7e3fea",
  },
  abilities: [
    {
      id: "12e-1",
      text: "SURPRISE PACKAGE {E}, 2 {I}, Banish this item — Draw a card, then choose and discard a card.",
      name: "SURPRISE PACKAGE",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
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
    },
    {
      id: "12e-2",
      text: "TIME GROWS SHORT During your turn, when this item is banished, deal 3 damage to chosen character or location.",
      name: "TIME GROWS SHORT",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "deal-damage",
        amount: 3,
        target: {
          selector: "chosen",
          cardTypes: ["character", "location"],
        },
      },
      condition: {
        type: "turn",
        whose: "your",
      },
    },
  ],
};
