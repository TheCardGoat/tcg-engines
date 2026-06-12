import type { CharacterCard } from "@tcg/op-types";
import { op06MonkeyDGarp055I18n } from "./055-monkey-d-garp.i18n.ts";

export const op06MonkeyDGarp055: CharacterCard = {
  id: "OP06-055",
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP06",
  cost: 5,
  power: 7000,
  traits: ["Navy"],
  attribute: "strike",
  effect:
    "[DON!! x2][When Attacking] If you have 4 or less cards in your hand, your opponent cannot activate [Blocker] during this battle.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 2,
          },
          {
            condition: "handCount",
            player: "self",
            comparison: "lte",
            value: 4,
          },
        ],
        actions: [
          {
            action: "cannotActivate",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op06MonkeyDGarp055I18n,
};
