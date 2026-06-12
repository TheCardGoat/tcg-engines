import type { CharacterCard } from "@tcg/op-types";
import { op12Gyukimaru024I18n } from "./024-gyukimaru.i18n.ts";

export const op12Gyukimaru024: CharacterCard = {
  id: "OP12-024",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Animal Land of Wano"],
  attribute: "slash",
  effect:
    "If this Character is active, this Character cannot be K.O.'d by your opponent's effects.\n[When Attacking] If you have a total of 3 or more given DON!! cards, rest up to 1 of your opponent's Characters with a base cost of 6 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 3,
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
                  filter: "baseCost",
                  comparison: "lte",
                  value: 6,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op12Gyukimaru024I18n,
};
