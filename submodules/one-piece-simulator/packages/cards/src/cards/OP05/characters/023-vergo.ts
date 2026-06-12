import type { CharacterCard } from "@tcg/op-types";
import { op05Vergo023I18n } from "./023-vergo.i18n.ts";

export const op05Vergo023: CharacterCard = {
  id: "OP05-023",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Donquixote Pirates Navy"],
  attribute: "strike",
  effect:
    "[DON!! x1][When Attacking] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
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
            action: "ko",
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05Vergo023I18n,
};
