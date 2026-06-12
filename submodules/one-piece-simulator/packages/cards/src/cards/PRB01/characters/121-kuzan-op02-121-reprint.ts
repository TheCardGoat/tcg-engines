import type { CharacterCard } from "@tcg/op-types";
import { prb01KuzanOp02121Reprint121I18n } from "./121-kuzan-op02-121-reprint.i18n.ts";

export const prb01KuzanOp02121Reprint121: CharacterCard = {
  id: "OP02-121",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "PRB01",
  cost: 10,
  power: 10000,
  traits: ["Former Navy"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-121_p3.jpg",
      imageId: "OP02-121_p3",
    },
  ],
  effect:
    "[Your Turn] Give all of your opponent's Characters -5 cost.[On Play] K.O. up to 1 of your opponent's Characters with a cost of 0.Disclaimer: This card was reprinted from the original set with changes to the artist credit (note the lack of pen symbol next to the artist name).",
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
  i18n: prb01KuzanOp02121Reprint121I18n,
};
