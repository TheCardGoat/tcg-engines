import type { CharacterCard } from "@tcg/op-types";
import { op08CharlottePuddingSp112I18n } from "./112-charlotte-pudding-sp.i18n.ts";

export const op08CharlottePuddingSp112: CharacterCard = {
  id: "OP03-112",
  cardType: "character",
  color: ["yellow"],
  rarity: "R",
  setId: "OP08",
  cost: 1,
  power: 2000,
  counter: 1000,
  traits: ["Big Mom Pirates"],
  attribute: "wisdom",
  effect:
    "[On Play] Look at 4 cards from the top of your deck; reveal up to 1 [Sanji] or [Big Mom Pirates] type card other than [Charlotte Pudding] and add it to your hand. Then, place the rest at the bottom of your deck in any order.",
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
                filter: "excludeName",
                value: "Charlotte Pudding",
              },
              {
                filter: "trait",
                value: "Sanji",
              },
              {
                filter: "trait",
                value: "Big Mom Pirates",
              },
            ],
            revealDestination: "hand",
            remainderPosition: "bottom",
          },
        ],
      },
    ],
  },
  i18n: op08CharlottePuddingSp112I18n,
};
