import type { CharacterCard } from "@tcg/op-types";
import { prb02MarshallDTeachOp09093Reprint093I18n } from "./093-marshall-d-teach-op09-093-reprint.i18n.ts";

export const prb02MarshallDTeachOp09093Reprint093: CharacterCard = {
  id: "OP09-093",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "PRB02",
  cost: 10,
  power: 12000,
  traits: ["Blackbeard Pirates The Four Emperors"],
  attribute: "special",
  effect:
    '[Blocker][Activate: Main] [Once Per Turn] If your Leader has the "Blackbeard Pirates" type and this Character was played on this turn, negate the effect of up to 1 of your opponent\'s Leader during this turn. Then, negate the effect of up to 1 of your opponent\'s Characters and that Character cannot attack until the end of your opponent\'s next turn.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "activateMain",
        conditions: [
          {
            condition: "compound",
            operator: "and",
            conditions: [
              {
                condition: "leaderTrait",
                trait: "Blackbeard Pirates",
              },
              {
                condition: "playedThisTurn",
              },
            ],
          },
        ],
        actions: [
          {
            action: "negateEffects",
            target: {
              player: "opponent",
              zones: ["leader"],
              count: {
                amount: 1,
                upTo: true,
              },
            },
            duration: "thisTurn",
          },
        ],
        oncePerTurn: true,
      },
    ],
  },
  i18n: prb02MarshallDTeachOp09093Reprint093I18n,
};
