import type { CharacterCard } from "@tcg/op-types";
import { op02Nami036I18n } from "./036-nami.i18n.ts";

export const op02Nami036: CharacterCard = {
  id: "OP02-036",
  cardType: "character",
  color: ["green"],
  rarity: "SR",
  setId: "OP02",
  cost: 3,
  power: 5000,
  traits: ["Film Straw Hat Crew"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP02-036_p1.jpg",
      imageId: "OP02-036_p1",
    },
  ],
  effect:
    '[On Play]/[When Attacking] (1) (You may rest the specified number of DON!! cards in your cost area.): Look at 3 cards from the top of your deck; reveal up to 1 "FILM" type card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
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
                filter: "excludeName",
                value: "Nami",
              },
              {
                filter: "trait",
                value: "FILM",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
      {
        trigger: "whenAttacking",
        costs: [
          {
            cost: "restDon",
            amount: 1,
          },
        ],
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
                filter: "excludeName",
                value: "Nami",
              },
              {
                filter: "trait",
                value: "FILM",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op02Nami036I18n,
};
