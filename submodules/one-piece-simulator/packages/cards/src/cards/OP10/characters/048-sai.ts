import type { CharacterCard } from "@tcg/op-types";
import { op10Sai048I18n } from "./048-sai.i18n.ts";

export const op10Sai048: CharacterCard = {
  id: "OP10-048",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP10",
  cost: 3,
  power: 5000,
  traits: ["Happosui Army Dressrosa"],
  attribute: "slash",
  effect:
    "[On Play] You may rest 1 of your \"Dressrosa\" type Leader or Stage cards: Return up to 1 of your opponent's Characters with a cost of 1 or less to the owner's hand.",
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
              {
                filter: "cardCategory",
                value: "stage",
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
                  value: 1,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op10Sai048I18n,
};
