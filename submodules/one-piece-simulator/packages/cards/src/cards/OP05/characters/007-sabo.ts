import type { CharacterCard } from "@tcg/op-types";
import { op05Sabo007I18n } from "./007-sabo.i18n.ts";

export const op05Sabo007: CharacterCard = {
  id: "OP05-007",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP05",
  cost: 6,
  power: 7000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-007_p1.jpg",
      imageId: "OP05-007_p1",
    },
  ],
  effect:
    "[On Play] K.O. up to 2 of your opponent's Characters with a total power of 4000 or less.",
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
                amount: 2,
                upTo: true,
              },
              totalConstraint: {
                property: "power",
                comparison: "lte",
                value: 4000,
              },
            },
          },
        ],
      },
    ],
  },
  i18n: op05Sabo007I18n,
};
