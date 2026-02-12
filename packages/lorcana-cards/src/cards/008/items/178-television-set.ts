import type { ItemCard } from "@tcg/lorcana-types";

export const televisionSet: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "it's a Puppy character card",
        },
        then: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
      },
      id: "pbp-1",
      text: "IS IT ON YET? {E}, 1 {I} —  Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
      type: "activated",
    },
  ],
  cardNumber: 178,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "5b45cb0bebfa4d4f18e8a0e2778ff4f77a31480b",
  },
  franchise: "101 Dalmatians",
  id: "pbp",
  inkType: ["sapphire"],
  inkable: true,
  missingTests: true,
  name: "Television Set",
  set: "008",
  text: "IS IT ON YET? {E}, 1 {I} —  Look at the top card of your deck. If it's a Puppy character card, you may reveal it and put it into your hand. Otherwise, put it on the bottom of your deck.",
};
