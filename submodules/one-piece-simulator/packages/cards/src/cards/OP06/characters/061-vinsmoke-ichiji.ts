import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeIchiji061I18n } from "./061-vinsmoke-ichiji.i18n.ts";

export const op06VinsmokeIchiji061: CharacterCard = {
  id: "OP06-061",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP06",
  cost: 7,
  power: 7000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-061_p1.jpg",
      imageId: "OP06-061_p1",
    },
  ],
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, give up to 1 of your opponent's Characters -2000 power during this turn and this Character gains [Rush]. (This card can attack on the turn in which it is played.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2000,
            duration: "thisTurn",
          },
          {
            action: "grantKeyword",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            keyword: "rush",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op06VinsmokeIchiji061I18n,
};
