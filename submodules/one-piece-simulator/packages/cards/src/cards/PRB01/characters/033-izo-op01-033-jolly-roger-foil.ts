import type { CharacterCard } from "@tcg/op-types";
import { prb01IzoOp01033JollyRogerFoil033I18n } from "./033-izo-op01-033-jolly-roger-foil.i18n.ts";

export const prb01IzoOp01033JollyRogerFoil033: CharacterCard = {
  id: "OP01-033",
  cardType: "character",
  color: ["green"],
  rarity: "UC",
  setId: "PRB01",
  cost: 3,
  power: 3000,
  counter: 2000,
  traits: ["Former Whitebeard Pirates Land of Wano"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p5.jpg",
      imageId: "OP01-033_p5",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_r1.png",
      imageId: "OP01-033_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-033_p5_8AI2ZwU.jpg",
      imageId: "OP01-033_p5",
    },
  ],
  effect: "[On Play] Rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
    ],
  },
  i18n: prb01IzoOp01033JollyRogerFoil033I18n,
};
