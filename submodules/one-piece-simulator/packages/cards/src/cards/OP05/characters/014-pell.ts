import type { CharacterCard } from "@tcg/op-types";
import { op05Pell014I18n } from "./014-pell.i18n.ts";

export const op05Pell014: CharacterCard = {
  id: "OP05-014",
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
