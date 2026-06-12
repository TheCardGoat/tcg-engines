import type { CharacterCard } from "@tcg/op-types";
import { prb02Nami012I18n } from "./012-nami.i18n.ts";

export const prb02Nami012: CharacterCard = {
  id: "PRB02-012",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB02",
  cost: 2,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/PRB02-012_p1.jpg",
      imageId: "PRB02-012_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order.[Trigger] Play this card.',
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
                value: "Nami",
              },
              {
                filter: "trait",
                value: "Straw Hat Crew",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "trigger",
        actions: [
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
            },
          },
        ],
      },
    ],
  },
  i18n: prb02Nami012I18n,
};
