import type { CharacterCard } from "@tcg/op-types";
import { prb02SaboOp04083Reprint083I18n } from "./083-sabo-op04-083-reprint.i18n.ts";

export const prb02SaboOp04083Reprint083: CharacterCard = {
  id: "OP04-083",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 5,
  power: 6000,
  traits: ["Revolutionary Army Dressrosa"],
  attribute: "special",
  effect:
    '[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play] None of your Characters can be K.O.\'d by effects until the start of your next turn. Then, draw 2 cards and trash 2 cards from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright) and the Artist Credit (Note: there is no pencil design on top of the artist name).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "cannotBeKod",
            target: {
              player: "self",
              zones: ["character"],
              count: {
                amount: "all",
              },
            },
            duration: "untilStartOfNextTurn",
            restriction: "byEffect",
          },
          {
            action: "draw",
            player: "self",
            amount: 2,
          },
          {
            action: "trashFromHand",
            player: "self",
            amount: 2,
          },
        ],
      },
    ],
  },
  i18n: prb02SaboOp04083Reprint083I18n,
};
