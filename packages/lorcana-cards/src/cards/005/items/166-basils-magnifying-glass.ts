import type { ItemCard } from "@tcg/lorcana-types";

export const basilsMagnifyingGlass: ItemCard = {
  id: "pnm",
  cardType: "item",
  name: "Basil's Magnifying Glass",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 2,
  cardNumber: 166,
  inkable: true,
  externalIds: {
    ravensburger: "02918ccd3a403f27aeb1591007157c27c8cb9736",
  },
  abilities: [
    {
      id: "pnm-1",
      text: "FIND WHAT'S HIDDEN {E}, 2 {I} — Look at the top 3 cards of your deck. You may reveal an item card and put it into your hand. Put the rest on the bottom of your deck in any order.",
      name: "FIND WHAT'S HIDDEN",
      type: "activated",
      cost: {
        exert: true,
        ink: 0,
      },
      effect: {
        type: "look-at-cards",
        amount: 0,
        from: "top-of-deck",
        target: "CONTROLLER",
        then: {
          action: "put-in-hand",
          filter: {
            type: "card-type",
            cardType: "item",
          },
        },
      },
    },
  ],
};
