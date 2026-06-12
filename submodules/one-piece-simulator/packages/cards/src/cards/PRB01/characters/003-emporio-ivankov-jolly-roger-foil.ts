import type { CharacterCard } from "@tcg/op-types";
import { prb01EmporioIvankovJollyRogerFoil003I18n } from "./003-emporio-ivankov-jolly-roger-foil.i18n.ts";

export const prb01EmporioIvankovJollyRogerFoil003: CharacterCard = {
  id: "OP06-003",
  cardType: "character",
  color: ["red"],
  rarity: "UC",
  setId: "PRB01",
  cost: 5,
  power: 6000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_p3.jpg",
      imageId: "OP06-003_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-003_r1.png",
      imageId: "OP06-003_r1",
    },
  ],
  effect:
    "[On Play] Look at 3 cards from the top of your deck and play up to 1 [Revolutionary Army] type Character card with 5000 power or less. Then, place the rest at the bottom of your deck in any order.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 3,
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
                filter: "power",
                comparison: "lte",
                value: 5000,
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
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
  i18n: prb01EmporioIvankovJollyRogerFoil003I18n,
};
