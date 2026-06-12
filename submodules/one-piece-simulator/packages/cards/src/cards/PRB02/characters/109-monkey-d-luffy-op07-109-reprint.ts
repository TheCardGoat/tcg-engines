import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDLuffyOp07109Reprint109I18n } from "./109-monkey-d-luffy-op07-109-reprint.i18n.ts";

export const prb02MonkeyDLuffyOp07109Reprint109: CharacterCard = {
  id: "OP07-109",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  traits: ["Straw Hat Crew The Four Emperors Egghead"],
  attribute: "strike",
  effect:
    "[Activate: Main]You may trash this Character: If you have 2 or less Life cards, K.O. up to 1 of your opponent's Characters with a cost of 4 or less. Then, draw 1 card.[Trigger] K.O. up to 1 of your opponent's Characters with a cost of 4 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "lifeCount",
            player: "self",
            comparison: "lte",
            value: 2,
          },
        ],
        costs: [
          {
            cost: "trashThisCard",
          },
        ],
        actions: [
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
                  filter: "cost",
                  comparison: "lte",
                  value: 4,
                },
              ],
            },
          },
          {
            action: "draw",
            player: "self",
            amount: 1,
          },
        ],
        optional: true,
      },
      {
        trigger: "trigger",
        actions: [
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
  i18n: prb02MonkeyDLuffyOp07109Reprint109I18n,
};
