import type { ItemCard } from "@tcg/lorcana-types";

export const rlsLegacysCannon: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "deal-damage",
      },
      id: "1rt-1",
      text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
      type: "activated",
    },
  ],
  cardNumber: 202,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "e3f387f2b59dcd08d2b328296fa4c6ef0dcb7867",
  },
  franchise: "Treasure Planet",
  id: "1rt",
  inkType: ["steel"],
  inkable: false,
  missingTests: true,
  name: "RLS Legacy's Cannon",
  set: "004",
  text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
};
