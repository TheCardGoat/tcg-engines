import type { CharacterCard } from "@tcg/op-types";
import { op12ShimotsukiKouzaburou029I18n } from "./029-shimotsuki-kouzaburou.i18n.ts";

export const op12ShimotsukiKouzaburou029: CharacterCard = {
  id: "OP12-029",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP12",
  cost: 3,
  power: 2000,
  counter: 2000,
  traits: ["Land of Wano East Blue Frost Moon Village"],
  attribute: "slash",
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost of 2 or less. Then, K.O. up to 1 of your opponent's rested Characters with a base cost of 1 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rest",
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
          },
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
                  filter: "baseCost",
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
  i18n: op12ShimotsukiKouzaburou029I18n,
};
