import type { CharacterCard } from "@tcg/op-types";
import { op02Strawberry101I18n } from "./101-strawberry.i18n.ts";

export const op02Strawberry101: CharacterCard = {
  id: "OP02-101",
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "OP02",
  cost: 4,
  power: 5000,
  traits: ["Navy"],
  attribute: "slash",
  effect:
    "[When Attacking] If there is a Character with a cost of 0, your opponent cannot activate the [Blocker] of any Character with a cost of 5 or less during this battle.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "existsOnField",
            zone: "character",
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 0,
              },
            ],
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
              filters: [
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
            keyword: "blocker",
            duration: "thisBattle",
          },
        ],
      },
    ],
  },
  i18n: op02Strawberry101I18n,
};
