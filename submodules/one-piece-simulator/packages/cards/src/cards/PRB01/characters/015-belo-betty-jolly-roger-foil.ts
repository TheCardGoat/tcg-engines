import type { CharacterCard } from "@tcg/op-types";
import { prb01BeloBettyJollyRogerFoil015I18n } from "./015-belo-betty-jolly-roger-foil.i18n.ts";

export const prb01BeloBettyJollyRogerFoil015: CharacterCard = {
  id: "OP05-015",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Revolutionary Army"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_r1.png",
      imageId: "OP05-015_r1",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p4.png",
      imageId: "OP05-015_p4",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP05-015_p5.jpg",
      imageId: "OP05-015_p5",
    },
  ],
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Revolutionary Army] type card other than [Belo Betty] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                value: "Belo Betty",
              },
              {
                filter: "trait",
                value: "Revolutionary Army",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01BeloBettyJollyRogerFoil015I18n,
};
