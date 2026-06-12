import type { EventCard } from "@tcg/op-types";
import { op03OutOfTheBag036I18n } from "./036-out-of-the-bag.i18n.ts";

export const op03OutOfTheBag036: EventCard = {
  id: "OP03-036",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP03",
  cost: 3,
  traits: ["NULL"],
  effect:
    "[Main] You may rest 1 of your [East Blue] type Characters: Set up to 1 of your [Kuro] cards as active. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "East Blue",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Kuro",
                },
              ],
            },
          },
        ],
        optional: true,
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
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op03OutOfTheBag036I18n,
};
