import type { EventCard } from "@tcg/op-types";
import { op07SnakeDance055I18n } from "./055-snake-dance.i18n.ts";

export const op07SnakeDance055: EventCard = {
  id: "OP07-055",
  cardType: "event",
  color: ["blue"],
  rarity: "C",
  setId: "OP07",
  cost: 2,
  traits: ["Kuja Pirates"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +4000 power during this battle. Then, return up to 1 of your Characters to the owner's hand. [Trigger] You may return 1 of your Characters to the owner's hand: Return up to 1 of your opponent's Characters with a cost of 5 or less to the owner's hand.",
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
            value: 4000,
            duration: "thisBattle",
          },
          {
            action: "returnToHand",
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
            action: "returnToHand",
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op07SnakeDance055I18n,
};
