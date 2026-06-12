import type { EventCard } from "@tcg/op-types";
import { op06WhiteSnake059I18n } from "./059-white-snake.i18n.ts";

export const op06WhiteSnake059: EventCard = {
  id: "OP06-059",
  cardType: "event",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 2,
  trigger:
    "Look at 5 cards from the top of your deck and place them at the top or bottom of your deck in any order.",
  traits: ["Navy"],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +1000 power during this turn, and draw 1 card.",
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
            value: 1000,
            duration: "thisTurn",
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op06WhiteSnake059I18n,
};
