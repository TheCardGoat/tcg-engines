import type { EventCard } from "@tcg/op-types";
import { op10RadioKnife041I18n } from "./041-radio-knife.i18n.ts";

export const op10RadioKnife041: EventCard = {
  id: "OP10-041",
  canonicalId: "OP10-041",
  slug: "radio-knife",
  name: "Radio Knife",
  printings: [
    {
      id: "OP10-041",
      artId: "OP10-041",
      setCode: "OP10",
      collectorNumber: "041",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-041.jpg",
    },
  ],
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
      {
        trigger: "trigger",
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: { amount: 1, upTo: true },
              filters: [{ filter: "cost", comparison: "lte", value: 4 }],
            },
          },
        ],
      },
    ],
  },
  i18n: op10RadioKnife041I18n,
};
