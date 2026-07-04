import type { CharacterCard } from "@tcg/op-types";
import { op13NefeltariVivi012I18n } from "./012-nefeltari-vivi.i18n.ts";

export const op13NefeltariVivi012: CharacterCard = {
  id: "OP13-012",
  canonicalId: "OP13-012",
  slug: "nefeltari-vivi/op13-012",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "OP13-012",
      artId: "OP13-012",
      setCode: "OP13",
      collectorNumber: "012",
      rarity: "R",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-012_76uztI0.jpg",
    },
  ],
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP13",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Alabasta" or "Straw Hat Crew" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                filter: "cost",
                comparison: "gte",
                value: 2,
              },
              {
                filter: "trait",
                value: "Alabasta",
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
  i18n: op13NefeltariVivi012I18n,
};
