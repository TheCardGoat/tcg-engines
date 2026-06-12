import type { CharacterCard } from "@tcg/op-types";
import { op02CurlyDadan005I18n } from "./005-curly-dadan.i18n.ts";

export const op02CurlyDadan005: CharacterCard = {
  id: "OP02-005",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Mountain Bandits"],
  attribute: "slash",
  effect:
    "[On Play] Look at up to 5 cards from the top of your deck; reveal up to 1 red Character with a cost of 1 and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op02CurlyDadan005I18n,
};
