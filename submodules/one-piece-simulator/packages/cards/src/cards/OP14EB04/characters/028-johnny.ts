import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Johnny028I18n } from "./028-johnny.i18n.ts";

export const op14eb04Johnny028: CharacterCard = {
  id: "OP14-028",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP14EB04",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["East Blue"],
  attribute: "slash",
  effect:
    "[Your Turn] When this Character becomes rested, K.O. up to 1 of your opponent's rested Characters with a cost of 2 or less.",
  effects: {
    effects: [
      {
        trigger: "whenBecomesRested",
        conditions: [
          {
            condition: "turn",
            value: "your",
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
                  value: 2,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Johnny028I18n,
};
