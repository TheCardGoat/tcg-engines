import type { EventCard } from "@tcg/op-types";
import { prb01ElThorJollyRogerFoil114I18n } from "./114-el-thor-jolly-roger-foil.i18n.ts";

export const prb01ElThorJollyRogerFoil114: EventCard = {
  id: "OP05-114",
  cardType: "event",
  color: ["yellow"],
  rarity: "UC",
  setId: "PRB01",
  cost: 1,
  traits: ["Sky Island"],
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p3.jpg",
      imageId: "OP05-114_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-114_p2.png",
      imageId: "OP05-114_p2",
    },
  ],
  effect:
    "[Counter] Up to 1 of your Leader or Character cards gains +2000 power during this battle. Then, if your opponent has 2 or less Life cards, that card gains an additional +2000 power during this battle.[Trigger] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life Cards.",
  effects: {
    effects: [
      {
        trigger: "counter",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "thisBattle",
          },
        ],
      },
      {
        trigger: "trigger",
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
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "opponentLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb01ElThorJollyRogerFoil114I18n,
};
