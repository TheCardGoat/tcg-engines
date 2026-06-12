import type { CharacterCard } from "@tcg/op-types";
import { op01Brook022I18n } from "./022-brook.i18n.ts";

export const op01Brook022: CharacterCard = {
  id: "OP01-022",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Give up to 2 of your opponent's Characters -2000 power during this turn.",
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
                amount: 2,
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
  i18n: op01Brook022I18n,
};
