import type { EventCard } from "@tcg/op-types";
import { op01ParadiseWaterfall057I18n } from "./057-paradise-waterfall.i18n.ts";

export const op01ParadiseWaterfall057: EventCard = {
  id: "OP01-057",
  cardType: "event",
  color: ["green"],
  rarity: "UC",
  setId: "OP01",
  cost: 1,
  traits: ["Land of Wano Kouzuki Clan"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, set up to 1 of your Characters as active. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.  This card has been officially errata'd.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
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
    ],
  },
  i18n: op01ParadiseWaterfall057I18n,
};
