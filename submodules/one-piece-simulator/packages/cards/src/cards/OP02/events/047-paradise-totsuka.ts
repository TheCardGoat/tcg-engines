import type { EventCard } from "@tcg/op-types";
import { op02ParadiseTotsuka047I18n } from "./047-paradise-totsuka.i18n.ts";

export const op02ParadiseTotsuka047: EventCard = {
  id: "OP02-047",
  cardType: "event",
  color: ["green"],
  rarity: "R",
  setId: "OP02",
  cost: 1,
  traits: ["Land of Wano Kouzuki Clan"],
  effect:
    "[Main] Rest up to 1 of your opponent's Characters with a cost of 4 or less. [Trigger] K.O. up to 1 of your opponent's rested Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "rest",
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
  i18n: op02ParadiseTotsuka047I18n,
};
