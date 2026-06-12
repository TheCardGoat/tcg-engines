import type { CharacterCard } from "@tcg/op-types";
import { prb01IzoOp03003JollyRogerFoil003I18n } from "./003-izo-op03-003-jolly-roger-foil.i18n.ts";

export const prb01IzoOp03003JollyRogerFoil003: CharacterCard = {
  id: "OP03-003",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Land of Wano Whitebeard Pirates"],
  attribute: "ranged",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_r2.jpg",
      imageId: "OP03-003_r2",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p5.jpg",
      imageId: "OP03-003_p5",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP03-003_p6.jpg",
      imageId: "OP03-003_p6",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 card with a type including "Whitebeard Pirates" other than [Izo] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "search",
            lookCount: 5,
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
                value: "Izo",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01IzoOp03003JollyRogerFoil003I18n,
};
