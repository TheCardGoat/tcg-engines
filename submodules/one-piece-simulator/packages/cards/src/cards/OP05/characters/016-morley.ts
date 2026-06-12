import type { CharacterCard } from "@tcg/op-types";
import { op05Morley016I18n } from "./016-morley.i18n.ts";

export const op05Morley016: CharacterCard = {
  id: "OP05-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 3,
  power: 5000,
  traits: ["Giant Revolutionary Army"],
  attribute: "special",
  effect:
    "[When Attacking] If this Character has 7000 power or more, your opponent cannot activate [Blocker] during this battle. [Trigger] You may trash 1 card from your hand: If your Leader is multicolored, play this card.",
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
            value: 7000,
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
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderMulticolored",
          },
        ],
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: op05Morley016I18n,
};
