import type { CharacterCard } from "@tcg/op-types";
import { prb02CharlottePuddingReprint047I18n } from "./047-charlotte-pudding-reprint.i18n.ts";

export const prb02CharlottePuddingReprint047: CharacterCard = {
  id: "OP06-047",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 4,
  power: 4000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-047_p1.jpg",
      imageId: "OP06-047",
    },
  ],
  effect:
    '[On Play] Your opponent returns all cards in their hand to their deck and shuffles their deck. Then, your opponent draws 5 cards.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "returnToDeck",
            target: {
              player: "opponent",
              zones: ["hand"],
              count: {
                amount: "all",
              },
            },
            position: "any",
          },
          {
            action: "draw",
            player: "opponent",
            amount: 5,
          },
        ],
      },
    ],
  },
  i18n: prb02CharlottePuddingReprint047I18n,
};
