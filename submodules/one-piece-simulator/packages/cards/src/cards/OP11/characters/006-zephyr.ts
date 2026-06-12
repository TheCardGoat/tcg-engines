import type { CharacterCard } from "@tcg/op-types";
import { op11Zephyr006I18n } from "./006-zephyr.i18n.ts";

export const op11Zephyr006: CharacterCard = {
  id: "OP11-006",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP11",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["FILM Neo Navy"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] Give up to 1 of your opponent's (Special) attribute Characters 5000 power during this turn.",
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
              filters: [
                {
                  filter: "attribute",
                  value: "special",
                },
              ],
            },
            value: 5000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op11Zephyr006I18n,
};
