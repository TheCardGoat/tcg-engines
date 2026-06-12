import type { CharacterCard } from "@tcg/op-types";
import { prb02DraculeMihawkOp09048Reprint048I18n } from "./048-dracule-mihawk-op09-048-reprint.i18n.ts";

export const prb02DraculeMihawkOp09048Reprint048: CharacterCard = {
  id: "OP09-048",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB02",
  cost: 6,
  power: 7000,
  traits: ["Cross Guild"],
  attribute: "slash",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] Draw 2 cards and trash 1 card from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: prb02DraculeMihawkOp09048Reprint048I18n,
};
