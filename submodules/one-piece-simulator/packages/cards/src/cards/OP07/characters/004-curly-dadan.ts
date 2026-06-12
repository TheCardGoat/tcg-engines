import type { CharacterCard } from "@tcg/op-types";
import { op07CurlyDadan004I18n } from "./004-curly-dadan.i18n.ts";

export const op07CurlyDadan004: CharacterCard = {
  id: "OP07-004",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP07",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Mountain Bandits Mountain Bandits"],
  attribute: "slash",
  effect:
    "[On Play] You may trash 1 card from your hand: Look at 5 cards from the top of your deck; reveal up to 1 Character card with 2000 power or less and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
                filter: "power",
                comparison: "lte",
                value: 2000,
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
        optional: true,
      },
    ],
  },
  i18n: op07CurlyDadan004I18n,
};
