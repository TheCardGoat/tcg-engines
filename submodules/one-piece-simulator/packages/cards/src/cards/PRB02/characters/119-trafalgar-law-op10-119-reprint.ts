import type { CharacterCard } from "@tcg/op-types";
import { prb02TrafalgarLawOp10119Reprint119I18n } from "./119-trafalgar-law-op10-119-reprint.i18n.ts";

export const prb02TrafalgarLawOp10119Reprint119: CharacterCard = {
  id: "OP10-119",
  cardType: "character",
  color: ["yellow"],
  rarity: "SEC",
  setId: "PRB02",
  cost: 7,
  power: 9000,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-119_p1_sEtXfvx.jpg",
      imageId: "OP10-119_p1",
    },
  ],
  effect:
    '[On Play] Reveal up to 1 "Supernovas" type Character card from your hand and add it to the top of your Life cards face-down. Then, give up to 1 rested DON!! card to 1 of your "Supernovas" type Leader.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader"],
              count: {
                amount: 1,
              },
              filters: [
                {
                  filter: "trait",
                  value: "Supernovas",
                },
              ],
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: prb02TrafalgarLawOp10119Reprint119I18n,
};
