import type { CharacterCard } from "@tcg/op-types";
import { op05Gedatsu102I18n } from "./102-gedatsu.i18n.ts";

export const op05Gedatsu102: CharacterCard = {
  id: "OP05-102",
  canonicalId: "OP05-102",
  slug: "gedatsu",
  name: "Gedatsu",
  printings: [
    {
      id: "OP05-102",
      artId: "OP05-102",
      setCode: "OP05",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-102.jpg",
    },
    {
      id: "OP05-102_p1",
      artId: "OP05-102_p1",
      setCode: "OP05",
      collectorNumber: "102",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-102_p1.jpg",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Sky Island Vassals"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-102_p1.jpg",
      imageId: "OP05-102_p1",
    },
  ],
  effect:
    "[On Play] K.O. up to 1 of your opponent's Characters with a cost equal to or less than the number of your opponent's Life cards.",
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
  i18n: op05Gedatsu102I18n,
};
