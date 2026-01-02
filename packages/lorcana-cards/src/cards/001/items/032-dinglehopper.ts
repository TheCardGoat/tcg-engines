import type { ItemCard } from "@tcg/lorcana-types";

export const dinglehopper: ItemCard = {
  id: "7r6",
  cardType: "item",
  name: "Dinglehopper",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "001",
  text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
  cost: 1,
  cardNumber: 32,
  inkable: true,
  externalIds: {
    ravensburger: "00c6be6408d3d9e54f25ef26b390b9087bf722cb",
  },
  abilities: [
    {
      id: "7r6-1",
      text: "STRAIGHTEN HAIR {E} — Remove up to 1 damage from chosen character.",
      name: "STRAIGHTEN HAIR",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "remove-damage",
        amount: 1,
        target: "CHOSEN_CHARACTER",
        upTo: true,
      },
    },
  ],
};
