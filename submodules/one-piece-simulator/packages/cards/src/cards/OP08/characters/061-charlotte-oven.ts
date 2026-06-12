import type { CharacterCard } from "@tcg/op-types";
import { op08CharlotteOven061I18n } from "./061-charlotte-oven.i18n.ts";

export const op08CharlotteOven061: CharacterCard = {
  id: "OP08-061",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP08",
  cost: 5,
  power: 6000,
  traits: ["Big Mom Pirates"],
  attribute: "special",
  effect:
    "[When Attacking] DON!! 1 (You may return the specified number of DON!! cards from your field to your DON!! deck.): K.O. up to 1 of your opponent's Characters with a cost of 3 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "returnDon",
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
  i18n: op08CharlotteOven061I18n,
};
