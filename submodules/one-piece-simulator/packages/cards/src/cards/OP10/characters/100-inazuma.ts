import type { CharacterCard } from "@tcg/op-types";
import { op10Inazuma100I18n } from "./100-inazuma.i18n.ts";

export const op10Inazuma100: CharacterCard = {
  id: "OP10-100",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP10",
  cost: 4,
  power: 5000,
  counter: 1000,
  trigger:
    'If your Leader has the "Revolutionary Army" type and you and your opponent have a total of 5 or less Life cards, play this card.',
  traits: ["Revolutionary Army"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Rest up to 1 of your opponent's Characters with a cost equal to or less than the total of your and your opponent's Life cards.",
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
            action: "rest",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "dynamicCost",
                  comparison: "lte",
                  source: "totalLifeCount",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op10Inazuma100I18n,
};
