import type { CharacterCard } from "@tcg/op-types";
import { eb03Alvida021I18n } from "./021-alvida.i18n.ts";

export const eb03Alvida021: CharacterCard = {
  id: "EB03-021",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "EB03",
  cost: 4,
  power: 2000,
  counter: 1000,
  traits: ["Cross Guild"],
  attribute: "strike",
  effect:
    "[On Play] You may trash 1 card from your hand: Place up to 1 of your opponent's Characters with 4000 base power or less and up to 1 Character with a base cost of 3 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
              filters: [
                {
                  filter: "basePower",
                  comparison: "lte",
                  value: 4000,
                },
              ],
            },
            position: "bottom",
          },
          {
            action: "returnToDeck",
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
                  value: 3,
                },
              ],
            },
            position: "bottom",
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: eb03Alvida021I18n,
};
