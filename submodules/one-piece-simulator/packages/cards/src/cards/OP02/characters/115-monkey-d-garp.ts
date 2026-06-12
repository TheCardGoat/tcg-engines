import type { CharacterCard } from "@tcg/op-types";
import { op02MonkeyDGarp115I18n } from "./115-monkey-d-garp.i18n.ts";

export const op02MonkeyDGarp115: CharacterCard = {
  id: "OP02-115",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-115_p1.jpg",
      imageId: "OP02-115_p1",
    },
  ],
  effect:
    "[DON!! x2] [When Attacking] K.O. up to 1 of your opponent's Characters with a cost of 0.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
        ],
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
  },
  i18n: op02MonkeyDGarp115I18n,
};
