import type { EventCard } from "@tcg/op-types";
import { op09IceBlockPartisan115I18n } from "./115-ice-block-partisan.i18n.ts";

export const op09IceBlockPartisan115: EventCard = {
  id: "OP09-115",
  canonicalId: "OP09-115",
  slug: "ice-block-partisan",
  name: "Ice Block Partisan",
  printings: [
    {
      id: "OP09-115",
      artId: "OP09-115",
      setCode: "OP09",
      collectorNumber: "115",
      rarity: "UC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-115.jpg",
    },
  ],
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP09",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["Navy"],
  effect:
    "[Main] K.O. up to 1 of your opponent's Characters with a cost of 3 or less and a [Trigger].",
  effects: {
    effects: [
      {
        trigger: "main",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
                {
                  filter: "hasTrigger",
                  value: true,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [{ action: "draw", player: "self", amount: 1 }],
      },
    ],
  },
  i18n: op09IceBlockPartisan115I18n,
};
