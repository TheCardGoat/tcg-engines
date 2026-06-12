import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeReiju069I18n } from "./069-vinsmoke-reiju.i18n.ts";

export const op06VinsmokeReiju069: CharacterCard = {
  id: "OP06-069",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-069_p1.jpg",
      imageId: "OP06-069_p1",
    },
  ],
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field and you have 5 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "donFieldComparison",
                selfComparison: "lte",
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: op06VinsmokeReiju069I18n,
};
