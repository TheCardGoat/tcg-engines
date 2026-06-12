import type { CharacterCard } from "@tcg/op-types";
import { eb02Carrot013I18n } from "./013-carrot.i18n.ts";

export const eb02Carrot013: CharacterCard = {
  id: "EB02-013",
  cardType: "character",
  color: ["green"],
  rarity: "C",
  setId: "EB02",
  cost: 1,
  power: 0,
  counter: 2000,
  traits: ["Minks"],
  attribute: "special",
  effect:
    "[On Play] If you have 3 or more DON!! cards on your field, look at 7 cards from the top of your deck; reveal up to 1 [Zou] and add it to your hand. Then, place the rest at the bottom of your deck in any order and play up to 1 [Zou] from your hand.",
  effects: {
    effects: [
      {
        trigger: "onPlay",
        conditions: [
          {
            condition: "donFieldCount",
            player: "self",
            comparison: "gte",
            value: 3,
          },
        ],
        actions: [
          {
            action: "search",
            lookCount: 7,
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
                filter: "name",
                value: "Zou",
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
                filter: "name",
                value: "Zou",
              },
            ],
          },
        ],
      },
    ],
  },
  i18n: eb02Carrot013I18n,
};
