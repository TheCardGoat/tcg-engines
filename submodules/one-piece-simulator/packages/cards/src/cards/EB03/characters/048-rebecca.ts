import type { CharacterCard } from "@tcg/op-types";
import { eb03Rebecca048I18n } from "./048-rebecca.i18n.ts";

export const eb03Rebecca048: CharacterCard = {
  id: "EB03-048",
  cardType: "character",
  color: ["black"],
  rarity: "R",
  setId: "EB03",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "wisdom",
  effect:
    "[Blocker] [On Play] Look at 5 cards from the top of your deck; reveal up to 1 {Dressrosa} type Stage card and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 {Dressrosa} type Stage card with a cost of 1 from your hand.",
  effects: {
    keywords: ["blocker"],
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
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "stage",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
          {
            action: "play",
            source: {
              player: "self",
              zone: "hand",
            },
            count: {
              amount: 1,
              upTo: true,
            },
            filters: [
              {
                filter: "cost",
                comparison: "eq",
                value: 1,
              },
              {
                filter: "trait",
                value: "Dressrosa",
              },
              {
                filter: "cardCategory",
                value: "stage",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb03Rebecca048I18n,
};
