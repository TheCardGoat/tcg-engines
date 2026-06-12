import type { CharacterCard } from "@tcg/op-types";
import { op03Gin024I18n } from "./024-gin.i18n.ts";

export const op03Gin024: CharacterCard = {
  id: "OP03-024",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP03",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Krieg Pirates East Blue"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-024_p1.jpg",
      imageId: "OP03-024_p1",
    },
  ],
  effect:
    "[On Play] If your Leader has the [East Blue] type, rest up to 2 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "East Blue",
          },
        ],
        actions: [
          {
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 2,
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
  i18n: op03Gin024I18n,
};
