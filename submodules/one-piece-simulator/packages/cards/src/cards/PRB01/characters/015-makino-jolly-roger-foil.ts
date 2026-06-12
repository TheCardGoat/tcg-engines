import type { CharacterCard } from "@tcg/op-types";
import { prb01MakinoJollyRogerFoil015I18n } from "./015-makino-jolly-roger-foil.i18n.ts";

export const prb01MakinoJollyRogerFoil015: CharacterCard = {
  id: "OP02-015",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Windmill Village"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_p4.jpg",
      imageId: "OP02-015_p4",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-015_r1.png",
      imageId: "OP02-015_r1",
    },
  ],
  effect:
    "[Activate:Main] You may rest this Character: Up to 1 of your red Characters with a cost of 1 gains +3000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        costs: [
          {
            cost: "restThisCard",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "color",
                  value: "red",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
            value: 3000,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb01MakinoJollyRogerFoil015I18n,
};
