import type { CharacterCard } from "@tcg/op-types";
import { op10Mansherry056I18n } from "./056-mansherry.i18n.ts";

export const op10Mansherry056: CharacterCard = {
  id: "OP10-056",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP10",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
  attribute: "special",
  effect:
    '[On Play] You may rest 1 of your "Dressrosa" type Leader or Stage cards, and return 1 of your "Dressrosa" type Characters with a cost of 4 or more to the owner\'s hand: Return up to 1 of your opponent\'s Characters with a cost of 4 or less to the owner\'s hand.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restCards",
            amount: 1,
            filters: [
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "leader",
              },
            ],
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
                  value: 4,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Mansherry056I18n,
};
