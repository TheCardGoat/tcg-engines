import type { CharacterCard } from "@tcg/op-types";
import { op08Wapol014I18n } from "./014-wapol.i18n.ts";

export const op08Wapol014: CharacterCard = {
  id: "OP08-014",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP08",
  cost: 6,
  power: 6000,
  counter: 1000,
  traits: ["Drum Kingdom"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters 2000 power during this turn. Then, this Character gains +2000 power until the end of your opponent's next turn.",
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
            value: 2000,
            duration: "thisTurn",
          },
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
            value: 2000,
            duration: "untilEndOfOpponentNextTurn",
          },
        ],
      },
    ],
  },
  i18n: op08Wapol014I18n,
};
