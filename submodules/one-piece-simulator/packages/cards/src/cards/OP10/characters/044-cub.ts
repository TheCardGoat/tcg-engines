import type { CharacterCard } from "@tcg/op-types";
import { op10Cub044I18n } from "./044-cub.i18n.ts";

export const op10Cub044: CharacterCard = {
  id: "OP10-044",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP10",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Dressrosa The Tontattas"],
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
  i18n: op10Cub044I18n,
};
