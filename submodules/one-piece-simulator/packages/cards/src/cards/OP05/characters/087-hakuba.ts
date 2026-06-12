import type { CharacterCard } from "@tcg/op-types";
import { op05Hakuba087I18n } from "./087-hakuba.i18n.ts";

export const op05Hakuba087: CharacterCard = {
  id: "OP05-087",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Beautiful Pirates Dressrosa"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking] You may K.O. 1 of your Characters other than this Character: Give up to 1 of your opponent's Characters -5 cost during this turn.",
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
            value: -5,
            duration: "thisTurn",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Hakuba087I18n,
};
