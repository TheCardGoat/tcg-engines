import type { ItemCard } from "@tcg/lorcana-types";

export const starlightVial: ItemCard = {
  id: "1ec",
  cardType: "item",
  name: "Starlight Vial",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "003",
  text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.\nTRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
  cost: 4,
  cardNumber: 99,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b54a0a0a6287b0a37be5933c25f861901de4eb52",
  },
  abilities: [
    {
      id: "1ec-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.",
    },
    {
      id: "1ec-2",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "draw",
            amount: 2,
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
      text: "TRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
    },
  ],
};
