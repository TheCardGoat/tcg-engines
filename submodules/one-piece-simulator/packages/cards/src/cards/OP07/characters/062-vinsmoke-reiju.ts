import type { CharacterCard } from "@tcg/op-types";
import { op07VinsmokeReiju062I18n } from "./062-vinsmoke-reiju.i18n.ts";

export const op07VinsmokeReiju062: CharacterCard = {
  id: "OP07-062",
  cardType: "character",
  color: ["purple"],
  rarity: "C",
  setId: "OP07",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "strike",
  effect:
    "[On Play] If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, return up to 1 of your [The Vinsmoke Family] type Characters with a cost of 1 to the owner's hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldComparison",
            selfComparison: "lte",
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "trait",
                  value: "The Vinsmoke Family",
                },
                {
                  filter: "cost",
                  comparison: "eq",
                  value: 1,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op07VinsmokeReiju062I18n,
};
