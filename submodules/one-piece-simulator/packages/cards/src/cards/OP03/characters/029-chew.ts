import type { CharacterCard } from "@tcg/op-types";
import { op03Chew029I18n } from "./029-chew.i18n.ts";

export const op03Chew029: CharacterCard = {
  id: "OP03-029",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "OP03",
  cost: 4,
  power: 3000,
  counter: 1000,
  traits: ["Fish-Man Arlong Pirates East Blue"],
  attribute: "ranged",
  effect:
    "[On Play] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less. [Trigger] Play this card.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: op03Chew029I18n,
};
