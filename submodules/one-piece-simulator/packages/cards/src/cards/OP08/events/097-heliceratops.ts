import type { EventCard } from "@tcg/op-types";
import { op08Heliceratops097I18n } from "./097-heliceratops.i18n.ts";

export const op08Heliceratops097: EventCard = {
  id: "OP08-097",
  cardType: "event",
  color: ["black"],
  rarity: "C",
  setId: "OP08",
  cost: 3,
  traits: ["Animal Kingdom Pirates"],
  effect:
    "[Main] If your Leader has the [Animal Kingdom Pirates] type, give up to 1 of your opponent's Characters 2 cost during this turn. Then, K.O. up to 1 of your opponent's Characters with a cost of 0. [Trigger] K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Animal Kingdom Pirates",
          },
        ],
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
            value: 2,
            duration: "thisTurn",
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
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
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
  i18n: op08Heliceratops097I18n,
};
