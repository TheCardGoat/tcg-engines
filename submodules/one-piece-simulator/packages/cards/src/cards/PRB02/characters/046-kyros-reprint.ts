import type { CharacterCard } from "@tcg/op-types";
import { prb02KyrosReprint046I18n } from "./046-kyros-reprint.i18n.ts";

export const prb02KyrosReprint046: CharacterCard = {
  id: "OP10-046",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 9000,
  traits: ["Dressrosa"],
  attribute: "slash",
  effect:
    '[On Play] Return up to 1 Character with a cost of 5 or less to the owner\'s hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToHand",
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
      },
    ],
  },
  i18n: prb02KyrosReprint046I18n,
};
