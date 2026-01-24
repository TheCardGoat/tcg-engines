import type { ItemCard } from "@tcg/lorcana-types";

export const munchingsAndCrunchings: ItemCard = {
  id: "16w",
  cardType: "item",
  name: "Munchings and Crunchings",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.\nCOME ON OUT You pay 1 {I} less to play characters named Gurgi.",
  cost: 2,
  cardNumber: 33,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "9a9b1c40e3d11ec217057176fbb7eef45d983670",
  },
  abilities: [
    {
      id: "16w-1",
      type: "activated",
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
      text: "WHAT A JUICY APPLE {E} — Remove up to 2 damage from chosen character.",
    },
    {
      id: "16w-2",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "COME ON OUT You pay 1 {I} less to play characters named Gurgi.",
    },
  ],
};
