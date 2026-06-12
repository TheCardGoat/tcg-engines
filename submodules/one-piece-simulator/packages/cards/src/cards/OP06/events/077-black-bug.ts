import type { EventCard } from "@tcg/op-types";
import { op06BlackBug077I18n } from "./077-black-bug.i18n.ts";

export const op06BlackBug077: EventCard = {
  id: "OP06-077",
  cardType: "event",
  color: ["purple"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  trigger:
    "Place up to 1 of your opponent's Characters with a cost of 4 or less at the bottom of the owner's deck.",
  traits: ["The Vinsmoke Family GERMA 66"],
  effect:
    "[Main] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, place up to 1 of your opponent's Characters with a cost of 5 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "main",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "returnToDeck",
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
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06BlackBug077I18n,
};
