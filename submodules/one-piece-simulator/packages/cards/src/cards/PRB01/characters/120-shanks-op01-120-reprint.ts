import type { CharacterCard } from "@tcg/op-types";
import { prb01ShanksOp01120Reprint120I18n } from "./120-shanks-op01-120-reprint.i18n.ts";

export const prb01ShanksOp01120Reprint120: CharacterCard = {
  id: "OP01-120",
  cardType: "character",
  color: ["red"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors Red-Haired Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_r2.jpg",
      imageId: "OP01-120_r2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-120_p5.jpg",
      imageId: "OP01-120_p5",
    },
  ],
  effect:
    "[Rush] (This card can attack on the turn in which it is played.)[When Attacking] Your opponent cannot activate a [Blocker] Character that has 2000 or less power during this battle.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01ShanksOp01120Reprint120I18n,
};
