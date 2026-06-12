import type { CharacterCard } from "@tcg/op-types";
import { op05UsoHachi061I18n } from "./061-uso-hachi.i18n.ts";

export const op05UsoHachi061: CharacterCard = {
  id: "OP05-061",
  cardType: "character",
  color: ["purple"],
  rarity: "UC",
  setId: "OP05",
  cost: 3,
  power: 4000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "ranged",
  effect:
    "[DON!! x1][When Attacking] If you have 8 or more DON!! cards on your field, rest up to 1 of your opponent's Characters with a cost of 4 or less.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
        conditions: [
          {
            condition: "donAttached",
            amount: 1,
          },
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 8,
          },
        ],
        actions: [
          {
            action: "rest",
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
                  value: 4,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: op05UsoHachi061I18n,
};
