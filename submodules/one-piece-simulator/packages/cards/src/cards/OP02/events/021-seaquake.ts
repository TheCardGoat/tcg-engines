import type { EventCard } from "@tcg/op-types";
import { op02Seaquake021I18n } from "./021-seaquake.i18n.ts";

export const op02Seaquake021: EventCard = {
  id: "OP02-021",
  cardType: "event",
  color: ["red"],
  rarity: "R",
  setId: "OP02",
  cost: 1,
  traits: ["The Four Emperors Whitebeard Pirates"],
  effect:
    "[Main] If your Leader's type includes \"Whitebeard Pirates\", K.O. up to 1 of your opponent's Characters with 3000 power or less. [Trigger] Give up to 1 of your opponent's Leader or Character cards -3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Whitebeard Pirates",
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -3000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Seaquake021I18n,
};
