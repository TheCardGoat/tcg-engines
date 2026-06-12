import type { StageCard } from "@tcg/op-types";
import { op05MaryGeoise097I18n } from "./097-mary-geoise.i18n.ts";

export const op05MaryGeoise097: StageCard = {
  id: "OP05-097",
  cardType: "stage",
  color: ["black"],
  rarity: "C",
  setId: "OP05",
  cost: 1,
  traits: ["Mary Geoise"],
  effect:
    "[Your Turn] The cost of playing [Celestial Dragons] type Character cards with a cost of 2 or more from your hand will be reduced by 1.",
  effects: {
    permanentEffects: [
      {
        conditions: [
          {
            condition: "turn",
            value: "your",
          },
        ],
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "self",
              zones: ["hand"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "trait",
                  value: "Celestial Dragons",
                },
                {
                  filter: "cardCategory",
                  value: "character",
                },
                {
                  filter: "cost",
                  comparison: "gte",
                  value: 2,
                },
              ],
            },
            value: -1,
          },
        ],
      },
    ],
  },
  i18n: op05MaryGeoise097I18n,
};
