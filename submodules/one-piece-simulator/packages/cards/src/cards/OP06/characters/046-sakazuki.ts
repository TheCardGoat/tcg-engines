import type { CharacterCard } from "@tcg/op-types";
import { op06Sakazuki046I18n } from "./046-sakazuki.i18n.ts";

export const op06Sakazuki046: CharacterCard = {
  id: "OP06-046",
  cardType: "character",
  color: ["blue"],
  rarity: "UC",
  setId: "OP06",
  cost: 5,
  power: 6000,
  traits: ["Navy"],
  attribute: "special",
  effect:
    "[On Play] Place up to 1 Character with a cost of 2 or less at the bottom of the owner's deck.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
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
                  filter: "cost",
                  comparison: "lte",
                  value: 2,
                },
              ],
            },
            position: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op06Sakazuki046I18n,
};
