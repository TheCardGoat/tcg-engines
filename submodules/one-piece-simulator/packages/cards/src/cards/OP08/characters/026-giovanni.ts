import type { CharacterCard } from "@tcg/op-types";
import { op08Giovanni026I18n } from "./026-giovanni.i18n.ts";

export const op08Giovanni026: CharacterCard = {
  id: "OP08-026",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP08",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Minks"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Up to 1 of your opponent's rested Characters with a cost of 1 or less will not become active in your opponent's next Refresh Phase.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "freeze",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op08Giovanni026I18n,
};
