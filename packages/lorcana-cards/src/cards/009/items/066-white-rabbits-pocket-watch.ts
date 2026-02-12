import type { ItemCard } from "@tcg/lorcana-types";

export const whiteRabbitsPocketWatch: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      id: "ecf-1",
      text: "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn.",
      type: "activated",
    },
  ],
  cardNumber: 66,
  cardType: "item",
  cost: 3,
  externalIds: {
    ravensburger: "33b357a4ae708cc24a69167fda5f9129aa942bb6",
  },
  franchise: "Alice in Wonderland",
  id: "ecf",
  inkType: ["amethyst"],
  inkable: true,
  missingTests: true,
  name: "White Rabbit’s Pocket Watch",
  set: "009",
  text: "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
};
