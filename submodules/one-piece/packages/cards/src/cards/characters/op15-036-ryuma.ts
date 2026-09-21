import type { CharacterCard } from "@tcg/op-types";
import { op15Ryuma036I18n } from "./op15-036-ryuma.i18n.ts";

export const op15Ryuma036: CharacterCard = {
  id: "OP15-036",
  canonicalId: "OP15-036",
  slug: "ryuma/op15-036",
  name: "Ryuma",
  printings: [
    {
      id: "OP15-036",
      artId: "OP15-036",
      setCode: "OP15",
      collectorNumber: "036",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP15-036_DMwTtiz.jpg",
    },
  ],
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP15",
  cost: 6,
  power: 8000,
  traits: ["Land of Wano Thriller Bark Pirates"],
  attribute: "slash",
  effect:
    "[On Play]/[When Attacking] K.O. up to 1 of your opponent's rested Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op15Ryuma036I18n,
};
