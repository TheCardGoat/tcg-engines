import type { CharacterCard } from "@tcg/op-types";
import { eb03NefeltariViviEb02026026I18n } from "./026-nefeltari-vivi-eb02-026.i18n.ts";

export const eb03NefeltariViviEb02026026: CharacterCard = {
  id: "EB02-026",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "EB03",
  cost: 3,
  power: 2000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "slash",
  effect:
    "[On Play] If your Leader is multicolored and you have 5 or less cards in your hand, draw 2 cards.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderMulticolored",
              },
              {
                condition: "handCount",
                player: "self",
                comparison: "lte",
                value: 5,
              },
            ],
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: eb03NefeltariViviEb02026026I18n,
};
