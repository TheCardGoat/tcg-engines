import type { CharacterCard } from "@tcg/op-types";
import { prb01NamiOp01016Manga016I18n } from "./016-nami-op01-016-manga.i18n.ts";

export const prb01NamiOp01016Manga016: CharacterCard = {
  id: "OP01-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "PRB01",
  cost: 1,
  power: 2000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    '[On Play] Look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type Character card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order.',
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
              {
                filter: "cardCategory",
                value: "character",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: prb01NamiOp01016Manga016I18n,
};
