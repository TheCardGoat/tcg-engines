import type { CharacterCard } from "@tcg/op-types";
import { prb02Mr3GaldinoOp09056Reprint056I18n } from "./056-mr-3-galdino-op09-056-reprint.i18n.ts";

export const prb02Mr3GaldinoOp09056Reprint056: CharacterCard = {
  id: "OP09-056",
  cardType: "character",
  color: ["blue"],
  rarity: "R",
  setId: "PRB02",
  cost: 1,
  power: 2000,
  traits: ["Former Baroque Works Cross Guild"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-056_p1.jpg",
      imageId: "OP09-056_p1",
    },
  ],
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Cross Guild" type card or card with a type including "Baroque Works" other than [Mr.3(Galdino)] and add it to your hand. Then, place the rest at the bottom of your deck in any order.Disclaimer: This card was reprinted from the original set with changes to the copyright information (Note: the original print did not include "EN" at the end of the copyright).',
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
                filter: "excludeName",
                value: "Mr.3(Galdino)",
              },
              {
                filter: "trait",
                value: "Cross Guild",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb02Mr3GaldinoOp09056Reprint056I18n,
};
