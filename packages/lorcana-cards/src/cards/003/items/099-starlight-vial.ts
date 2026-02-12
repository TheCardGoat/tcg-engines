import type { ItemCard } from "@tcg/lorcana-types";

export const starlightVial: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "1ec-1",
      text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.",
      type: "activated",
    },
    {
      cost: { exert: true },
      effect: {
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
        type: "sequence",
      },
      id: "1ec-2",
      text: "TRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
      type: "activated",
    },
  ],
  cardNumber: 99,
  cardType: "item",
  cost: 4,
  externalIds: {
    ravensburger: "b54a0a0a6287b0a37be5933c25f861901de4eb52",
  },
  franchise: "Lorcana",
  id: "1ec",
  inkType: ["emerald"],
  inkable: false,
  missingTests: true,
  name: "Starlight Vial",
  set: "003",
  text: "EFFICIENT ENERGY {E} — You pay 2 {I} less for the next action you play this turn.\nTRAP 2 {I}, Banish this item — Draw 2 cards, then choose and discard a card.",
};
