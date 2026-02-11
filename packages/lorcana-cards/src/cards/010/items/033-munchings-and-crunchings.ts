import type { ItemCard } from "@tcg/lorcana-types";

export const munchingsAndCrunchings: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "remove-damage",
        amount: 2,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "16w-1",
      text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.",
      type: "activated",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "16w-2",
      text: "COME ON OUT You pay 1 {I} less to play characters named Gurgi.",
      type: "action",
    },
  ],
  cardNumber: 33,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "9a9b1c40e3d11ec217057176fbb7eef45d983670",
  },
  franchise: "Black Cauldron",
  id: "16w",
  inkType: ["amber"],
  inkable: true,
  missingTests: true,
  name: "Munchings and Crunchings",
  set: "010",
  text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.",
};
