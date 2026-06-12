import type { EventCard } from "@tcg/op-types";
import { op01YouCanBeMySamurai055I18n } from "./055-you-can-be-my-samurai.i18n.ts";

export const op01YouCanBeMySamurai055: EventCard = {
  id: "OP01-055",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "OP01",
  cost: 1,
  traits: ["Land of Wano Kouzuki Clan"],
  effect: "[Main] You may rest 2 of your Characters: Draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "main",
        costs: [
          {
            cost: "restCards",
            amount: 2,
            filters: [
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op01YouCanBeMySamurai055I18n,
};
