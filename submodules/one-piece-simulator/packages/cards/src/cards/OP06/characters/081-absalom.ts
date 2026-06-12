import type { CharacterCard } from "@tcg/op-types";
import { op06Absalom081I18n } from "./081-absalom.i18n.ts";

export const op06Absalom081: CharacterCard = {
  id: "OP06-081",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Thriller Bark Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-081_p1.jpg",
      imageId: "OP06-081_p1",
    },
  ],
  effect:
    "[On Play] You may return 2 cards from your trash to the bottom of your deck in any order: K.O. up to 1 Character with a cost of 2 or less.",
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
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06Absalom081I18n,
};
