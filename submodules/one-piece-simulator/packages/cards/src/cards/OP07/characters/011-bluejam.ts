import type { CharacterCard } from "@tcg/op-types";
import { op07Bluejam011I18n } from "./011-bluejam.i18n.ts";

export const op07Bluejam011: CharacterCard = {
  id: "OP07-011",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Goa Kingdom Bluejam Pirates"],
  attribute: "ranged",
  effect:
    "[DON!! x1][When Attacking] K.O. up to 1 of your opponent's Characters with 2000 power or less.",
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
                  value: 2000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07Bluejam011I18n,
};
