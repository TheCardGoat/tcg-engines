import type { CharacterCard } from "@tcg/op-types";
import { op03MonkeyDGarp014I18n } from "./014-monkey-d-garp.i18n.ts";

export const op03MonkeyDGarp014: CharacterCard = {
  id: "OP03-014",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP03",
  cost: 3,
  power: 5000,
  traits: ["Navy"],
  attribute: "strike",
  effect: "[When Attacking] Play up to 1 red Character card with a cost of 1 from your hand.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "color",
                value: "red",
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: op03MonkeyDGarp014I18n,
};
