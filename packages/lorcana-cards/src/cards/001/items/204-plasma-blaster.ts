import type { ItemCard } from "@tcg/lorcana";

export const plasmaBlaster: ItemCard = {
  id: "vmw",
  cardType: "item",
  name: "Plasma Blaster",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "001",
  text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
  cost: 3,
  cardNumber: 204,
  inkable: false,
  externalIds: {
    ravensburger: "7204a43d0ddbf91326f601cd9fbef27e72eae9fa",
  },
  abilities: [
    {
      id: "vmw-1",
      text: "QUICK SHOT {E}, 2 {I} — Deal 1 damage to chosen character.",
      name: "QUICK SHOT",
      type: "activated",
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        type: "deal-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
      },
    },
  ],
};
