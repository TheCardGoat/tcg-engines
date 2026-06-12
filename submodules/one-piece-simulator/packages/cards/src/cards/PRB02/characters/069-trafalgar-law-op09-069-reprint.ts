import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawOp09069Reprint069I18n } from "./069-trafalgar-law-op09-069-reprint.i18n.ts";

export const prb02TrafalgarLawOp09069Reprint069: CharacterCard = {
  id: "OP09-069",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  power: 2000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" or "Heart Pirates" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 4,
            source: {
              player: "self",
              zone: "deck",
            },
            revealCount: {
              amount: 1,
              upTo: true,
            },
            revealFilters: [
              {
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
              {
                filter: "trait",
                value: "Heart Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02TrafalgarLawOp09069Reprint069I18n,
};
