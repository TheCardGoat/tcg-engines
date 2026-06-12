import type { EventCard } from "@tcg/op-types";
import { op02IceAge117I18n } from "./117-ice-age.i18n.ts";

export const op02IceAge117: EventCard = {
  id: "OP02-117",
  cardType: "event",
  color: ["black"],
  rarity: "UC",
  setId: "OP02",
  cost: 1,
  traits: ["Navy"],
  effect:
    "[Main] Give up to 1 of your opponent's Characters -5 cost during this turn. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -5,
            duration: "thisTurn",
          },
        ],
      },
      {
        trigger: "trigger",
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
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02IceAge117I18n,
};
