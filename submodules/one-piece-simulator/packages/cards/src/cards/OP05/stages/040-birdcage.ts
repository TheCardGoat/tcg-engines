import type { StageCard } from "@tcg/op-types";
import { op05Birdcage040I18n } from "./040-birdcage.i18n.ts";

export const op05Birdcage040: StageCard = {
  id: "OP05-040",
  cardType: "stage",
  color: ["green"],
  rarity: "C",
  setId: "OP05",
  cost: 5,
  traits: ["NULL"],
  effect:
    "If your Leader is [Donquixote Doflamingo], all Characters with a cost of 5 or less do not become active in your and your opponent's Refresh Phases. [End of Your Turn] If you have 10 DON!! cards on your field, K.O. all rested Characters with a cost of 5 or less. Then, trash this SAtage.",
  effects: {
    effects: [
      {
        trigger: "endOfYourTurn",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "eq",
            value: 10,
          },
        ],
        actions: [
          {
            action: "ko",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: "all",
              },
              filters: [
                {
                  filter: "state",
                  value: "rested",
                },
                {
                  filter: "cost",
                  comparison: "lte",
                  value: 5,
                },
              ],
            },
          },
          {
            action: "trashThisCard",
          },
        ],
      },
    ],
  },
  i18n: op05Birdcage040I18n,
};
