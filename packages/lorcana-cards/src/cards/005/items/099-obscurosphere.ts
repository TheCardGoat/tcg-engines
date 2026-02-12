import type { ItemCard } from "@tcg/lorcana-types";

export const obscurosphere: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
        type: "gain-keyword",
      },
      id: "wfc-1",
      text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn.",
      type: "activated",
    },
  ],
  cardNumber: 99,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "74dd8432c36b5bf31c17f28c835974839a1dce6f",
  },
  franchise: "Lorcana",
  id: "wfc",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Obscurosphere",
  set: "005",
  text: "EXTRACT OF EMERALD 2 {I}, Banish this item — Your characters gain Ward until the start of your next turn. (Opponents can't choose them except to challenge.)",
};
