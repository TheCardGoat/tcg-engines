import type { CharacterCard } from "@tcg/op-types";
import { op01Okiku035I18n } from "./035-okiku.i18n.ts";

export const op01Okiku035: CharacterCard = {
  id: "OP01-035",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "OP01",
  cost: 3,
  power: 5000,
  traits: ["Land of Wano The Akazaya Nine"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] [Once Per Turn] Rest up to 1 of your opponent's Characters with a cost of 5 or less.  This card has been officially errata'd.",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: op01Okiku035I18n,
};
