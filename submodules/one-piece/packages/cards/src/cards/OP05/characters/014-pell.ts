import type { CharacterCard } from "@tcg/op-types";
import { op05Pell014I18n } from "./014-pell.i18n.ts";

export const op05Pell014: CharacterCard = {
  id: "OP05-014",
  canonicalId: "OP05-014",
  slug: "pell/op05-014",
  name: "Pell",
  printings: [
    {
      id: "OP05-014",
      artId: "OP05-014",
      setCode: "OP05",
      collectorNumber: "014",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-014.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking] Give up to 1 of your opponent's Characters -2000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
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
        ],
      },
    ],
  },
  i18n: op05Pell014I18n,
};
