import type { CharacterCard } from "@tcg/op-types";
import { op06Saga006I18n } from "./006-saga.i18n.ts";

export const op06Saga006: CharacterCard = {
  id: "OP06-006",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP06",
  cost: 4,
  power: 5000,
  counter: 2000,
  traits: ["FILM Asuka Island"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking] This Character gains +1000 power until the start of your next turn. Then, trash 1 of your [FILM] type Characters at the end of this turn.",
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
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
            value: 1000,
            duration: "untilStartOfNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op06Saga006I18n,
};
