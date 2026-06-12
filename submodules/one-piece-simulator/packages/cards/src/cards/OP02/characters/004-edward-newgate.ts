import type { CharacterCard } from "@tcg/op-types";
import { op02EdwardNewgate004I18n } from "./004-edward-newgate.i18n.ts";

export const op02EdwardNewgate004: CharacterCard = {
  id: "OP02-004",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "OP02",
  cost: 9,
  power: 10000,
  traits: ["The Four Emperors Whitebeard Pirates"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-004_p1.jpg",
      imageId: "OP02-004_p1",
    },
  ],
  effect:
    "[On Play] Up to 1 of your Leader gains +2000 power until the start of your next turn. Then, you cannot add Life cards to your hand using your own effects during this turn. [DON!! x2] [When Attacking] K.O. up to 1 of your opponent's Characters with 3000 power or less.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: 2000,
            duration: "untilStartOfNextTurn",
          },
          {
            action: "cannotBeRemoved",
            target: {
              player: "self",
              zones: ["life"],
              count: {
                amount: "all",
              },
            },
            duration: "thisTurn",
            bySource: "ownEffect",
          },
        ],
      },
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
                  filter: "power",
                  comparison: "lte",
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op02EdwardNewgate004I18n,
};
