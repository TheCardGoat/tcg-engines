import type { CharacterCard } from "@tcg/op-types";
import { prb02SanjiOp06119Reprint119I18n } from "./119-sanji-op06-119-reprint.i18n.ts";

export const prb02SanjiOp06119Reprint119: CharacterCard = {
  id: "OP06-119",
  cardType: "character",
  color: ["blue"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 9,
  power: 9000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-119_p3.jpg",
      imageId: "OP06-119_p3",
    },
  ],
  effect:
    '[On Play] Reveal 1 card from the top of your deck and play up to 1 Character with a cost of 9 or less other than [Sanji]. Then, place the rest at the bottom of your deck.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 1,
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
                filter: "excludeName",
                value: "Sanji",
              },
              {
                filter: "cost",
                comparison: "lte",
                value: 9,
              },
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "character",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02SanjiOp06119Reprint119I18n,
};
