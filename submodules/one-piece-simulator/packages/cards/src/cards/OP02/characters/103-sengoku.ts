import type { CharacterCard } from "@tcg/op-types";
import { op02Sengoku103I18n } from "./103-sengoku.i18n.ts";

export const op02Sengoku103: CharacterCard = {
  id: "OP02-103",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "OP02",
  cost: 2,
  power: 3000,
  counter: 2000,
  traits: ["Navy"],
  attribute: "wisdom",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's Characters -2 cost during this turn.",
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
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -2,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op02Sengoku103I18n,
};
