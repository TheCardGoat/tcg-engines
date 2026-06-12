import type { CharacterCard } from "@tcg/op-types";
import { op01KinEmon040I18n } from "./040-kin-emon.i18n.ts";

export const op01KinEmon040: CharacterCard = {
  id: "OP01-040",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP01",
  cost: 6,
  power: 6000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-040_p1.jpg",
      imageId: "OP01-040_p1",
    },
  ],
  effect:
    '[On Play] If your Leader is [Kouzuki Oden], play up to 1 "The Akazaya Nine" type Character card with a cost of 3 or less from your hand. [DON!! x1] [When Attacking] [Once Per Turn] Set up to 1 of your "The Akazaya Nine" type Character cards with a cost of 3 or less as active.  This card has been officially errata\'d.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderName",
            name: "Kouzuki Oden",
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
              {
                filter: "trait",
                value: "The Akazaya Nine",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "The Akazaya Nine",
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
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01KinEmon040I18n,
};
