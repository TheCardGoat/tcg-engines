import type { ItemCard } from "@tcg/lorcana-types";

export const rlsLegacysCannon: ItemCard = {
  id: "1rt",
  cardType: "item",
  name: "RLS Legacy's Cannon",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "004",
  text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
  cost: 3,
  cardNumber: 202,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e3f387f2b59dcd08d2b328296fa4c6ef0dcb7867",
  },
  abilities: [
    {
      id: "1rt-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "deal-damage",
        amount: 2,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
    },
  ],
};
