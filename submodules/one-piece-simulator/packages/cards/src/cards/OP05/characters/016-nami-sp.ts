import type { CharacterCard } from "@tcg/op-types";
import { op05NamiSp016I18n } from "./016-nami-sp.i18n.ts";

export const op05NamiSp016: CharacterCard = {
  id: "OP01-016",
  cardType: "character",
  color: ["red"],
  rarity: "R",
  setId: "OP05",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Straw Hat Crew"],
  attribute: "special",
  effect:
    "[On Play] Look at 5 cards from the top of your deck; reveal up to 1 [Straw Hat Crew] type card other than [Nami] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
  i18n: op05NamiSp016I18n,
};
