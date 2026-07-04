import type { EventCard } from "@tcg/op-types";
import { op01YouCanBeMySamurai055I18n } from "./055-you-can-be-my-samurai.i18n.ts";

export const op01YouCanBeMySamurai055: EventCard = {
  id: "OP01-055",
  canonicalId: "OP01-055",
  slug: "you-can-be-my-samurai",
  name: "You Can Be My Samurai!!",
  printings: [
    {
      id: "OP01-055",
      artId: "OP01-055",
      setCode: "OP01",
      collectorNumber: "055",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-055.jpg",
    },
  ],
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
