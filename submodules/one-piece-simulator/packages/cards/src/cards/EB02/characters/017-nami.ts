import type { CharacterCard } from "@tcg/op-types";
import { eb02Nami017I18n } from "./017-nami.i18n.ts";

export const eb02Nami017: CharacterCard = {
  id: "EB02-017",
  cardType: "character",
  color: ["green"],
  rarity: "R",
  setId: "EB02",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew East Blue"],
  attribute: "wisdom",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB02-017_p1.png",
      imageId: "EB02-017_p1",
    },
  ],
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
    ],
  },
  i18n: eb02Nami017I18n,
};
