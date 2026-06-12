import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboOp07118Reprint118I18n } from "./118-sabo-op07-118-reprint.i18n.ts";

export const prb02SaboOp07118Reprint118: CharacterCard = {
  id: "OP07-118",
  cardType: "character",
  color: ["black"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    "[On Play] You may trash 1 card from your hand: K.O. up to 1 of your opponent's Characters with a cost of 5 or less and up to 1 of your opponent's Characters with a cost of 3 or less.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "trashFromHand",
            amount: 1,
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
                  value: 5,
                },
              ],
            },
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02SaboOp07118Reprint118I18n,
};
