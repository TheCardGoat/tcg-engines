import type { CharacterCard } from "@tcg/op-types";
import { op03Krieg025I18n } from "./025-krieg.i18n.ts";

export const op03Krieg025: CharacterCard = {
  id: "OP03-025",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP03",
  cost: 6,
  power: 7000,
  traits: ["Krieg Pirates East Blue"],
  attribute: "ranged",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-025_p1.jpg",
      imageId: "OP03-025_p1",
    },
  ],
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 2 of your opponent's rested Characters with a cost of 4 or less. [DON!! x1] This Character gains [Double Attack]. (This card deals 2 damage.)",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
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
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
    permanentEffects: [
      {
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        actions: [
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
            keyword: "doubleAttack",
            duration: "permanent",
          },
        ],
      },
    ],
  },
  i18n: op03Krieg025I18n,
};
