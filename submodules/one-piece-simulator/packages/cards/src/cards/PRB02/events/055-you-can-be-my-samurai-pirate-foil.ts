import type { EventCard } from "@tcg/op-types";
import { prb02YouCanBeMySamuraiPirateFoil055I18n } from "./055-you-can-be-my-samurai-pirate-foil.i18n.ts";

export const prb02YouCanBeMySamuraiPirateFoil055: EventCard = {
  id: "OP01-055",
  cardType: "event",
  color: ["green"],
  rarity: "C",
  setId: "PRB02",
  cost: 1,
  traits: ["Land of Wano Kouzuki Clan"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-055_r1.jpg",
      imageId: "OP01-055_r1",
    },
  ],
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
  i18n: prb02YouCanBeMySamuraiPirateFoil055I18n,
};
