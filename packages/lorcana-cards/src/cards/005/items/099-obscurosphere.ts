import type { ItemCard } from "@tcg/lorcana-types";

export const obscurosphere: ItemCard = {
  id: "wfc",
  cardType: "item",
  name: "Obscurosphere",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "005",
  text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
  cost: 1,
  cardNumber: 99,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "74dd8432c36b5bf31c17f28c835974839a1dce6f",
  },
  abilities: [
    {
      id: "wfc-1",
      type: "activated",
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn.",
    },
  ],
};
