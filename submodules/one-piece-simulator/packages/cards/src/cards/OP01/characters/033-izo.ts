import type { CharacterCard } from "@tcg/op-types";
import { op01Izo033I18n } from "./033-izo.i18n.ts";

export const op01Izo033: CharacterCard = {
  id: "OP01-033",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Former Whitebeard Pirates Land of Wano"],
  attribute: "ranged",
  effect:
    "[On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.  This card has been officially errata'd.",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op01Izo033I18n,
};
