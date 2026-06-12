import type { CharacterCard } from "@tcg/op-types";
import { op07Hamburg068I18n } from "./068-hamburg.i18n.ts";

export const op07Hamburg068: CharacterCard = {
  id: "OP07-068",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP07",
  cost: 5,
  power: 6000,
  counter: 1000,
  traits: ["Foxy Pirates"],
  attribute: "strike",
  effect:
    "[DON!! x1] [When Attacking] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 DON!! card from your DON!! deck and rest it.",
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
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "addDon",
            count: {
              amount: 1,
              upTo: true,
            },
            state: "rested",
          },
        ],
      },
    ],
  },
  i18n: op07Hamburg068I18n,
};
