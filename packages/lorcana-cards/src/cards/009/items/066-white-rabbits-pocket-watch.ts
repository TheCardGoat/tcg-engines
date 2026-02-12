import type { ItemCard } from "@tcg/lorcana-types";

export const whiteRabbitsPocketWatch: ItemCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        keyword: "Rush",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
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
