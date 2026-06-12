import type { CharacterCard } from "@tcg/op-types";
import { prb01TsuruJollyRogerFoil106I18n } from "./106-tsuru-jolly-roger-foil.i18n.ts";

export const prb01TsuruJollyRogerFoil106: CharacterCard = {
  id: "OP02-106",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Navy"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_r2.jpg",
      imageId: "OP02-106_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-106_p5.jpg",
      imageId: "OP02-106_p5",
    },
  ],
  effect: "[On Play] Give up to 1 of your opponent's Characters -2 cost during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb01TsuruJollyRogerFoil106I18n,
};
