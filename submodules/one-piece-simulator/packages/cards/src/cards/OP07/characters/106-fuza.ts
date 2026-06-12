import type { CharacterCard } from "@tcg/op-types";
import { op07Fuza106I18n } from "./106-fuza.i18n.ts";

export const op07Fuza106: CharacterCard = {
  id: "OP07-106",
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "OP07",
  cost: 4,
  power: 6000,
  traits: ["Animal Sky Island"],
  attribute: "special",
  effect:
    "[DON!! x1] [When Attacking] If you have 1 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 1,
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
                  filter: "cost",
                  comparison: "lte",
                  value: 3,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07Fuza106I18n,
};
