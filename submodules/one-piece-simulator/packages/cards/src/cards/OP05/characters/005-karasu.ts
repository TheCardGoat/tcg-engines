import type { CharacterCard } from "@tcg/op-types";
import { op05Karasu005I18n } from "./005-karasu.i18n.ts";

export const op05Karasu005: CharacterCard = {
  id: "OP05-005",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] If your Leader has the [Revolutionary Army] type, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn. [When Attacking] If this Character has 7000 power or more, give up to 1 of your opponent's Leader or Character cards -1000 power during this turn.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "leaderTrait",
            trait: "Revolutionary Army",
          },
        ],
        actions: [
          {
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
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
            action: "modifyPower",
            target: {
              player: "opponent",
              zones: ["leader", "character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1000,
            duration: "thisTurn",
          },
        ],
      },
    ],
  },
  i18n: op05Karasu005I18n,
};
