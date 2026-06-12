import type { EventCard } from "@tcg/op-types";
import { op10RadioKnife041I18n } from "./041-radio-knife.i18n.ts";

export const op10RadioKnife041: EventCard = {
  id: "OP10-041",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP10",
  cost: 4,
  trigger: "Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  traits: ["Heart Pirates Supernovas Dressrosa"],
  effect:
    "[Main] Rest up to 1 of your opponent's Characters with a cost of 6 or less. Then, K.O. up to 1 of your opponent's rested Characters with a cost of 5 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
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
                  value: 6,
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10RadioKnife041I18n,
};
