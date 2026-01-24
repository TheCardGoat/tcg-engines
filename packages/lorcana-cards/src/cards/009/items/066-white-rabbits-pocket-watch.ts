import type { ItemCard } from "@tcg/lorcana-types";

export const whiteRabbitsPocketWatch: ItemCard = {
  id: "ecf",
  cardType: "item",
  name: "White Rabbit’s Pocket Watch",
  inkType: ["amethyst"],
  franchise: "Alice in Wonderland",
  set: "009",
  text: "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn. (They can challenge the turn they're played.)",
  cost: 3,
  cardNumber: 66,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "33b357a4ae708cc24a69167fda5f9129aa942bb6",
  },
  abilities: [
    {
      id: "ecf-1",
      type: "activated",
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
      text: "I'M LATE! {E}, 1 {I} — Chosen character gains Rush this turn.",
    },
  ],
};
