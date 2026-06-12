import type { CharacterCard } from "@tcg/op-types";
import { prb02BrookEb01046Reprint046I18n } from "./046-brook-eb01-046-reprint.i18n.ts";

export const prb02BrookEb01046Reprint046: CharacterCard = {
  id: "EB01-046",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 3,
  power: 4000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "slash",
  effect:
    "[On Play]/[When Attacking] Give up to 1 of your opponent's Characters -1 cost during this turn. Then, K.O. up to 1 of your opponent's Characters with a cost of 0.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include \"EN\" at the end of the copyright).",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
      {
        trigger: "whenAttacking",
        actions: [
          {
            action: "modifyCost",
            target: {
              player: "opponent",
              zones: ["character"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            value: -1,
            duration: "thisTurn",
          },
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
                  comparison: "eq",
                  value: 0,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  i18n: prb02BrookEb01046Reprint046I18n,
};
