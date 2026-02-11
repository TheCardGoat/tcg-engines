import type { ItemCard } from "@tcg/lorcana-types";

export const basilsMagnifyingGlass: ItemCard = {
  abilities: [
    {
      cost: {
        exert: true,
        ink: 0,
      },
      effect: {
        type: "look-at-cards",
        amount: 0,
        source: "deck",
        target: "CONTROLLER",
      },
      id: "pnm-1",
      name: "FIND WHAT'S HIDDEN",
      text: "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      type: "activated",
    },
  ],
  cardNumber: 166,
  cardType: "item",
  cost: 2,
  externalIds: {
    ravensburger: "02918ccd3a403f27aeb1591007157c27c8cb9736",
  },
  franchise: "Great Mouse Detective",
  id: "pnm",
  inkType: ["sapphire"],
  inkable: true,
  name: "Basil's Magnifying Glass",
  set: "005",
  text: "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
};
