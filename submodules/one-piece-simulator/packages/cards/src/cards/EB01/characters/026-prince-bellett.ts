import type { CharacterCard } from "@tcg/op-types";
import { eb01PrinceBellett026I18n } from "./026-prince-bellett.i18n.ts";

export const eb01PrinceBellett026: CharacterCard = {
  id: "EB01-026",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB01",
  cost: 2,
  power: 2000,
  counter: 2000,
  traits: ["Impel Down"],
  attribute: "ranged",
  effect:
    "[DON!! x1] [When Attacking] If you have 1 or less cards in your hand, return up to 1 Character with a cost of 3 or less to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: eb01PrinceBellett026I18n,
};
