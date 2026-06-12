import type { CharacterCard } from "@tcg/op-types";
import { op09TrafalgarLaw069I18n } from "./069-trafalgar-law.i18n.ts";

export const op09TrafalgarLaw069: CharacterCard = {
  id: "OP09-069",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "OP09",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Heart Pirates"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-069_p1.jpg",
      imageId: "OP09-069_p1",
    },
  ],
  effect:
    '[On Play] Look at 4 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" or "Heart Pirates" type card with a cost of 2 or more and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
                value: "Straw Hat Crew",
              },
              {
                filter: "trait",
                value: "Heart Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op09TrafalgarLaw069I18n,
};
