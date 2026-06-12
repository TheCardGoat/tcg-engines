import type { CharacterCard } from "@tcg/op-types";
import { op02Morley061I18n } from "./061-morley.i18n.ts";

export const op02Morley061: CharacterCard = {
  id: "OP02-061",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  effect:
    "[When Attacking] If you have 1 or less cards in your hand, your opponent cannot activate the [Blocker] of any Character with a cost of 5 or less during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op02Morley061I18n,
};
