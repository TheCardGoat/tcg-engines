import type { CharacterCard } from "@tcg/op-types";
import { op08EdwardWeevil042I18n } from "./042-edward-weevil.i18n.ts";

export const op08EdwardWeevil042: CharacterCard = {
  id: "OP08-042",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Seven Warlords of the Sea"],
  attribute: "slash",
  effect:
    "[DON!! x1] [When Attacking] Return up to 1 Character with a cost of 3 or less to the owner's hand.",
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
            action: "returnToHand",
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
  i18n: op08EdwardWeevil042I18n,
};
