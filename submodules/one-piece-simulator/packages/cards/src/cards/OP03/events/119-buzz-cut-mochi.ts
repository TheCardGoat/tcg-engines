import type { EventCard } from "@tcg/op-types";
import { op03BuzzCutMochi119I18n } from "./119-buzz-cut-mochi.i18n.ts";

export const op03BuzzCutMochi119: EventCard = {
  id: "OP03-119",
  cardType: "event",
  color: ["yellow"],
  rarity: "R",
  setId: "OP03",
  cost: 2,
  traits: ["Big Mom Pirates"],
  effect:
    "[Main] If you have less Life cards than your opponent, K.O. up to 1 of your opponent's Characters with a cost of 4 or less. [Trigger] Play up to 1 Character card with a cost of 4 or less and a [Trigger] from your hand.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "lifeComparison",
            selfComparison: "lt",
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
              upTo: true,
            },
            filters: [
              {
                filter: "hasTrigger",
                value: true,
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 4,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03BuzzCutMochi119I18n,
};
