import type { EventCard } from "@tcg/op-types";
import { op10Room117I18n } from "./117-room.i18n.ts";

export const op10Room117: EventCard = {
  id: "OP10-117",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "OP10",
  cost: 1,
  trigger: "Draw 1 card.",
  traits: ["Heart Pirates Supernovas"],
  effect:
    "[Counter] If you have 1 or less Life cards, up to 1 of your Leader or Character cards gains +3000 power during this battle. Then, set up to 1 of your Characters with a cost of 5 or less as active.",
  effects: {
    effects: [
      {
        trigger: "counter",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
          },
        ],
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
            value: 3000,
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
              filters: [
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
  i18n: op10Room117I18n,
};
