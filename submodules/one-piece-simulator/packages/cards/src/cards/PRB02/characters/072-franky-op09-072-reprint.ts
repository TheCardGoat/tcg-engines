import type { CharacterCard } from "@tcg/op-types";
import { prb02FrankyOp09072Reprint072I18n } from "./072-franky-op09-072-reprint.i18n.ts";

export const prb02FrankyOp09072Reprint072: CharacterCard = {
  id: "OP09-072",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "PRB02",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] DON!! 2, You may trash 1 card from your hand: Draw 2 cards.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "returnDon",
            amount: 2,
          },
          {
            cost: "trashFromHand",
            amount: 1,
          },
        ],
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
        ],
        optional: true,
      },
    ],
  },
  i18n: prb02FrankyOp09072Reprint072I18n,
};
