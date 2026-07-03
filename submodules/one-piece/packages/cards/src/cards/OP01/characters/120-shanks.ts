import type { CharacterCard } from "@tcg/op-types";
import { op01Shanks120I18n } from "./120-shanks.i18n.ts";

export const op01Shanks120: CharacterCard = {
  id: "OP01-120",
  canonicalId: "OP01-120",
  slug: "shanks/op01-120",
  name: "Shanks",
  printings: [
    {
      id: "OP01-120",
      artId: "OP01-120",
      setCode: "OP01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120.jpg",
    },
    {
      id: "OP01-120_p1",
      artId: "OP01-120_p1",
      setCode: "OP01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p1.jpg",
    },
    {
      id: "OP01-120_p2",
      artId: "OP01-120_p2",
      setCode: "OP01",
      collectorNumber: "120",
      rarity: "SEC",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p2.jpg",
    },
  ],
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
