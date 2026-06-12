import type { CharacterCard } from "@tcg/op-types";
import { op14eb04Urouge002I18n } from "./002-urouge.i18n.ts";

export const op14eb04Urouge002: CharacterCard = {
  id: "OP14-002",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "OP14EB04",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Fallen Monk Pirates Supernovas"],
  attribute: "strike",
  effect:
    "[When Attacking] If this Character has 5000 power or more, draw 1 card and K.O. up to 1 of your opponent's Characters with 3000 base power or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "cardState",
            target: "this",
            property: "power",
            comparison: "gte",
            value: 5000,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
          {
            action: "ko",
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
                  value: 3000,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op14eb04Urouge002I18n,
};
