import type { CharacterCard } from "@tcg/op-types";
import { prb02CrocodileOp09046Reprint046I18n } from "./046-crocodile-op09-046-reprint.i18n.ts";

export const prb02CrocodileOp09046Reprint046: CharacterCard = {
  id: "OP09-046",
  cardType: "character",
  color: ["blue"],
  rarity: "SR",
  setId: "PRB02",
  cost: 7,
  power: 7000,
  counter: 1000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  effect:
    '[On Play] Play up to 1 "Cross Guild" type Character card or Character card with a type including "Baroque Works" with a cost of 5 or less from your hand.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
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
              {
                filter: "trait",
                value: "Cross Guild",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: prb02CrocodileOp09046Reprint046I18n,
};
