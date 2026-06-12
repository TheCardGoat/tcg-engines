import type { CharacterCard } from "@tcg/op-types";
import { op01Shanks120I18n } from "./120-shanks.i18n.ts";

export const op01Shanks120: CharacterCard = {
  id: "OP01-120",
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "OP01",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p1.jpg",
      imageId: "OP01-120_p1",
    },
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p2.jpg",
      imageId: "OP01-120_p2",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.) [When Attacking] Your opponent cannot activate a [Blocker] Character that has 2000 or less power during this battle.",
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "power",
                  comparison: "lte",
                  value: 2000,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op01Shanks120I18n,
};
