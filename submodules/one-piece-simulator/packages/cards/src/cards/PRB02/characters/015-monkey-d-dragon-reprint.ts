import type { CharacterCard } from "@tcg/op-types";
import { prb02MonkeyDDragonReprint015I18n } from "./015-monkey-d-dragon-reprint.i18n.ts";

export const prb02MonkeyDDragonReprint015: CharacterCard = {
  id: "OP07-015",
  cardType: "character",
  color: ["red"],
  rarity: "SR",
  setId: "PRB02",
  cost: 8,
  power: 9000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  effect:
    '[Rush](This card can attack on the turn in which it is played.)[On Play] Give up to 2 rested DON!! cards to your Leader or 1 of your Characters.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["rush"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 2,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02MonkeyDDragonReprint015I18n,
};
