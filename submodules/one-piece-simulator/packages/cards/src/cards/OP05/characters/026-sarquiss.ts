import type { CharacterCard } from "@tcg/op-types";
import { op05Sarquiss026I18n } from "./026-sarquiss.i18n.ts";

export const op05Sarquiss026: CharacterCard = {
  id: "OP05-026",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Bellamy Pirates"],
  attribute: "slash",
  effect:
    "[DON!! x1][When Attacking][Once Per Turn] You may rest 1 of your Characters with a cost of 3 or more: Set this Character as active.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
        ],
        costs: [
          {
            cost: "restCards",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "setActive",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: 1,
              },
              self: true,
            },
          },
        ],
        optional: true,
        oncePerTurn: true,
      },
    ],
  },
  i18n: op05Sarquiss026I18n,
};
