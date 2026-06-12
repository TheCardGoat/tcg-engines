import type { CharacterCard } from "@tcg/op-types";
import { op06VinsmokeSora063I18n } from "./063-vinsmoke-sora.i18n.ts";

export const op06VinsmokeSora063: CharacterCard = {
  id: "OP06-063",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP06",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["The Vinsmoke Family Kingdom of GERMA"],
  attribute: "wisdom",
  effect:
    "[On Play] You may trash 1 card from your hand: If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, add up to 1 [The Vinsmoke Family] type Character card with 4000 power or less from your trash to your hand.",
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
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToHand",
            target: {
              player: "self",
              zones: ["trash"],
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
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "power",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op06VinsmokeSora063I18n,
};
