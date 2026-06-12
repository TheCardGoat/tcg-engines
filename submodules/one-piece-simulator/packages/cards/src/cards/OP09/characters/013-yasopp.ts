import type { CharacterCard } from "@tcg/op-types";
import { op09Yasopp013I18n } from "./013-yasopp.i18n.ts";

export const op09Yasopp013: CharacterCard = {
  id: "OP09-013",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP09",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Red-Haired Pirates"],
  attribute: "ranged",
  effect:
    "[On Play] Up to 1 of your Leader gains +1000 power until the end of your opponent's next turn.\n[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters 1000 power during this turn.",
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
            value: 1000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
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
            value: 1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op09Yasopp013I18n,
};
