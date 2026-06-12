import type { CharacterCard } from "@tcg/op-types";
import { prb02ModaPirateFoil014I18n } from "./014-moda-pirate-foil.i18n.ts";

export const prb02ModaPirateFoil014: CharacterCard = {
  id: "OP07-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Lulucia Kingdom"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-014_r1.jpg",
      imageId: "OP07-014_r1",
    },
  ],
  effect:
    "[Your Turn][On Play] Up to 1 of your [Portgas.D.Ace] cards gains +2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character", "stage", "costArea"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "name",
                  value: "Portgas.D.Ace",
                },
              ],
            },
            value: 2000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: prb02ModaPirateFoil014I18n,
};
