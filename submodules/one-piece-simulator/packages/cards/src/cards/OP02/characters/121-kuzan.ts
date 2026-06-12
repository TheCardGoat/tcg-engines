import type { CharacterCard } from "@tcg/op-types";
import { op02Kuzan121I18n } from "./121-kuzan.i18n.ts";

export const op02Kuzan121: CharacterCard = {
  id: "OP02-121",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "OP02",
  cost: 10,
  power: 10000,
  traits: ["Former Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-121_p1.jpg",
      imageId: "OP02-121_p1",
    },
  ],
  effect:
    "[Your Turn] Give all of your opponent's Characters -5 cost. [On Play] K.O. up to 1 of your opponent's Characters with a cost of 0.",
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
                  filter: "cost",
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            value: -5,
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op02Kuzan121I18n,
};
