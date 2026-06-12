import type { CharacterCard } from "@tcg/op-types";
import { op05Bastille048I18n } from "./048-bastille.i18n.ts";

export const op05Bastille048: CharacterCard = {
  id: "OP05-048",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
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
            action: "returnToDeck",
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
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op05Bastille048I18n,
};
